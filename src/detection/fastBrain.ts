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
import { Buffer } from 'buffer'; // RN has no global Buffer; jpeg-js needs it (§7.1)
import jpeg from 'jpeg-js';
import { FastBrain as C } from './constants';
import { extractFrames } from './frameExtractor';
import { cropLipRoi } from './lipCropper';

let model: TensorflowModel | null = null;

/** Load the bundled model once, before the first analysis (§7.7). Idempotent. */
export async function loadFastBrain(): Promise<void> {
  if (model) return;
  // [] = default CPU delegate (best for desktop parity — GPU delegates can shift
  // numbers slightly; revisit only if speed requires it, then re-run §9.3).
  model = await loadTensorflowModel(
    require('../../assets/models/fast_brain.tflite'),
    [],
  );
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

/**
 * Full Fast Brain pass over a video (§4.5). `durationMs` comes from the picker
 * asset (§7.3). Returns mean fake confidence over usable frames, or null if none.
 */
export async function analyze(
  videoUri: string,
  durationMs: number,
): Promise<number | null> {
  if (!model) throw new Error('Fast Brain not loaded');
  const frames = await extractFrames(videoUri, durationMs);

  const probs: number[] = [];
  for (const frameUri of frames) {
    const crop = await cropLipRoi(frameUri);
    if (!crop) continue; // no usable crop — average over the rest (§4.5)
    probs.push(await inferOne(crop));
  }

  if (!probs.length) return null;
  return probs.reduce((a, b) => a + b, 0) / probs.length;
}
