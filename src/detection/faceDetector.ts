// §7.0.1 — single helper that wraps the chosen ML Kit face detector, so the rest
// of the pipeline never depends on which library we picked.
//
// Library: @infinitered/react-native-mlkit-face-detection (config-plugin based,
// works with EAS managed builds). Its `frame` is reported in IMAGE PIXEL
// coordinates on both platforms (iOS: MLKit Vision face.frame; Android:
// face.boundingBox), with no normalization — verified in the package's native
// source — which is exactly the pixel-space box lipCropper.ts (§4.2) expects.
//
// NOTE: this is a NATIVE module. It only works in an EAS development build, never
// in Expo Go (§7.0). If the module fails to initialize, we return [] so the
// pipeline falls back to the fixed no-face box (§4.2 step 3) instead of crashing.

import { RNMLKitFaceDetector } from '@infinitered/react-native-mlkit-face-detection';

export interface FaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Lazily-initialized singleton — building the detector loads the native model.
let detector: RNMLKitFaceDetector | null = null;
let initPromise: Promise<void> | null = null;

async function getDetector(): Promise<RNMLKitFaceDetector | null> {
  try {
    if (!detector) {
      // 'accurate' catches more (incl. non-frontal/small) faces than 'fast'. On
      // video thumbnails 'fast' was missing faces on many frames, which forced the
      // no-face fallback box and dragged the averaged confidence toward the middle
      // (parity gap vs desktop). minFaceSize lowered so smaller faces still count.
      detector = new RNMLKitFaceDetector(
        { performanceMode: 'accurate', minFaceSize: 0.05 },
        true,
      );
    }
    if (!initPromise) {
      initPromise = detector.initialize();
    }
    await initPromise;
    return detector;
  } catch (e) {
    console.warn('[faceDetector] init failed, using fallback box:', e);
    return null;
  }
}

/**
 * Detects faces in the image at `imageUri`.
 * Returns pixel-space boxes [{ x, y, width, height }], or [] if none / unavailable.
 */
export async function detectFaces(imageUri: string): Promise<FaceBox[]> {
  const d = await getDetector();
  if (!d) return [];
  try {
    const result = await d.detectFaces(imageUri);
    if (!result?.success || !result.faces?.length) return [];
    return result.faces.map((f) => ({
      x: f.frame.origin.x,
      y: f.frame.origin.y,
      width: f.frame.size.x,
      height: f.frame.size.y,
    }));
  } catch (e) {
    console.warn('[faceDetector] detectFaces failed, using fallback box:', e);
    return [];
  }
}
