// §4.2 / §7.4 — face detection + lip crop, then resize to 224x224.
//
// Returns the cropped+resized 224x224 JPEG as a base64 string (NOT a uri). The
// spec's §7.4 returns a uri and reads it back with expo-file-system, but in Expo
// SDK 56 the classic FileSystem.readAsStringAsync throws at runtime. Instead we
// ask ImageManipulator for base64 directly via saveAsync({ base64: true }) — the
// pixels are identical, so the §4 contract is unchanged.
//
// Uses the SDK 52+ context API (manipulate().crop().resize().renderAsync()); the
// deprecated manipulateAsync is avoided.

import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { Image } from 'react-native';
import { FastBrain } from './constants';
import { detectFaces } from './faceDetector'; // §7.0.1 — pixel-space face boxes

function getImageSize(uri: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) =>
    Image.getSize(uri, (width, height) => resolve({ width, height }), reject),
  );
}

/** Returns the base64 of a 224x224 RGB JPEG lip crop, or null if unusable. */
export async function cropLipRoi(frameUri: string): Promise<string | null> {
  const { width: W, height: H } = await getImageSize(frameUri);

  const faces = await detectFaces(frameUri);

  let fx: number, fy: number, fw: number, fh: number;
  if (!faces.length) {
    // No face → fixed fallback box (§4.2 step 3).
    fx = W / 4;
    fy = H / 4;
    fw = W / 2;
    fh = H / 2;
  } else {
    // Largest face by bounding-box area (§4.2 step 2).
    const f = faces.reduce((a, b) =>
      a.width * a.height >= b.width * b.height ? a : b,
    );
    fx = f.x;
    fy = f.y;
    fw = f.width;
    fh = f.height;
  }

  // Raw lip box (§4.2 step 4).
  let y1 = fy + FastBrain.lipYStart * fh;
  let y2 = fy + FastBrain.lipYEnd * fh;
  const pad = FastBrain.lipPadding * fw;
  let x1 = fx - pad;
  let x2 = fx + fw + pad;

  // Square it, center-preserving (§4.2 step 5).
  const side = Math.max(x2 - x1, y2 - y1);
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  x1 = cx - side / 2;
  y1 = cy - side / 2;
  x2 = x1 + side;
  y2 = y1 + side;

  // Clamp to [0,W]/[0,H] (§4.2 step 6). Skip the frame if empty after clamping.
  const originX = Math.max(0, Math.round(x1));
  const originY = Math.max(0, Math.round(y1));
  const cropW = Math.min(W - originX, Math.round(side));
  const cropH = Math.min(H - originY, Math.round(side));
  if (cropW <= 0 || cropH <= 0) return null;

  // Crop + resize to 224x224 (§4.2 step 7), return base64 JPEG.
  const context = ImageManipulator.manipulate(frameUri)
    .crop({ originX, originY, width: cropW, height: cropH })
    .resize({ width: FastBrain.inputSize, height: FastBrain.inputSize });
  const image = await context.renderAsync();
  const result = await image.saveAsync({
    format: SaveFormat.JPEG,
    base64: true,
  });
  return result.base64 ?? null;
}
