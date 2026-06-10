// §4.3–4.5 / §7.5 — on-device TFLite inference for the Fast Brain.
//
// Pipeline per video: extract 8 frames → lip-crop each → run YOLO classifier →
// mean(fake prob). Returns the clip fake confidence, or null if no usable frame.
//
// API NOTE: react-native-fast-tflite v3 changed its run() signature. It now takes
// and returns ArrayBuffer[] (not the nested typed arrays §7.5 was written for):
//   run(input: ArrayBuffer[]): Promise<ArrayBuffer[]>
// So we pass the Float32Array's .buffer and read the output back via Float32Array.

import { loadTensorflowModel, TensorflowModel } from 'react-native-fast-tflite';
import { Asset } from 'expo-asset';
import { Buffer } from 'buffer'; // RN has no global Buffer; jpeg-js needs it (§7.1)
import jpeg from 'jpeg-js';
import { FastBrain as C } from './constants';
import { extractFrames } from './frameExtractor';
import { cropLipRoi } from './lipCropper';

let model: TensorflowModel | null = null;

/** Load the bundled model once, before the first analysis (§7.7). Idempotent. */
export async function loadFastBrain(): Promise<void> {
  if (model) return;

  // Passing require() straight to loadTensorflowModel works in a dev build (Metro
  // serves the model over http://) but FAILS in a standalone APK: fast-tflite
  // resolves a protocol-less asset name ("assets_models_fast_brain") and its
  // native loader throws `MalformedURLException: no protocol`. So resolve the
  // bundled asset to a real file:// URI with expo-asset and pass { url } instead,
  // which works in both dev and release.
  const asset = Asset.fromModule(require('../../assets/models/fast_brain.tflite'));
  if (!asset.downloaded) {
    await asset.downloadAsync();
  }
  const uri = asset.localUri ?? asset.uri;

  // [] = default CPU delegate (best for desktop parity — GPU delegates can shift
  // numbers slightly; revisit only if speed requires it, then re-run §9.3).
  model = await loadTensorflowModel({ url: uri }, []);
}

export function isFastBrainLoaded(): boolean {
  return model !== null;
}

/**
 * Decode a 224x224 base64 JPEG into a Float32Array of RGB, [0,1]-normalized, NHWC
 * (§4.3). jpeg-js yields RGBA; we drop alpha and keep channel order RGB (NOT BGR).
 */
function toInputTensor(base64Jpeg: string): Float32Array {
  const raw = jpeg.decode(Buffer.from(base64Jpeg, 'base64'), { useTArray: true });
  const n = C.inputSize;
  const out = new Float32Array(n * n * 3);
  for (let i = 0, j = 0; i < raw.data.length; i += 4) {
    out[j++] = raw.data[i] / 255; // R
    out[j++] = raw.data[i + 1] / 255; // G
    out[j++] = raw.data[i + 2] / 255; // B  (skip A)
  }
  return out;
}

/** Run one 224x224 crop, return the FAKE probability (output index 0, §4.4). */
async function inferOne(base64Jpeg: string): Promise<number> {
  if (!model) throw new Error('Fast Brain not loaded');
  const input = toInputTensor(base64Jpeg);
  const outputs = await model.run([input.buffer as ArrayBuffer]); // [1,224,224,3] -> [1,2]
  const probs = new Float32Array(outputs[0]); // [fake, real]
  return probs[C.fakeClassIndex];
}

export interface AnalyzeResult {
  confidence: number; // mean fake prob over usable frames (clip_fake_confidence)
  framesTotal: number; // frames extracted from the video
  framesUsed: number; // frames that produced a usable crop and were averaged
  framesWithFace: number; // frames where a REAL face was detected (rest = fallback box)
  perFrame: number[]; // per-frame fake prob, in order
}

/**
 * Full Fast Brain pass over a video (§4.5). `durationMs` comes from the picker
 * asset (§7.3). Returns the mean fake confidence + diagnostics, or null if no
 * frame was usable. framesWithFace vs framesUsed reveals how often the no-face
 * fallback box was used, which is the main driver of parity gaps vs desktop.
 */
export async function analyze(
  videoUri: string,
  durationMs: number,
): Promise<AnalyzeResult | null> {
  if (!model) throw new Error('Fast Brain not loaded');
  const frames = await extractFrames(videoUri, durationMs);

  const perFrame: number[] = [];
  let framesWithFace = 0;
  for (const frameUri of frames) {
    const crop = await cropLipRoi(frameUri);
    if (!crop) continue; // no usable crop — average over the rest (§4.5)
    if (crop.faceFound) framesWithFace++;
    perFrame.push(await inferOne(crop.base64));
  }

  if (!perFrame.length) return null;
  const confidence = perFrame.reduce((a, b) => a + b, 0) / perFrame.length;
  return {
    confidence,
    framesTotal: frames.length,
    framesUsed: perFrame.length,
    framesWithFace,
    perFrame,
  };
}
