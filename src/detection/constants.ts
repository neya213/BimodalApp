// Fast Brain on-device deepfake detector — non-negotiable constants.
//
// Source of truth: docs/MOBILE_YOLO_INTEGRATION.md §11 (which mirrors the ML repo's
// shared/config.py and fast_brain/prepare_data.py). A mismatch here produces WRONG
// RESULTS WITH NO ERROR — do not "simplify" or guess these values. See §4/§10.

export const FastBrain = {
  framesPerVideo: 8,        // evenly spaced, first -> last frame (§4.1)
  inputSize: 224,           // model input is 224x224 NHWC float32 (§4.3)

  // Lip-crop geometry as fractions of the face box (§4.2).
  lipYStart: 0.55,
  lipYEnd: 0.92,
  lipPadding: 0.1,

  // ⚠️ Ultralytics sorts class folders alphabetically: `fake` < `real`, so
  // fake is index 0, NOT 1. The per-frame fake prob is output[0][0] (§4.4).
  fakeClassIndex: 0,

  cascadeThreshold: 0.8,    // conf > 0.80 -> instant on-device "Deepfake", skip cloud (§4.6)
  binaryThreshold: 0.5,     // cloud-disabled fallback verdict: conf > 0.50 -> "Deepfake" (§4.6)

  apiPredictPath: '/predict',
  apiTimeoutMs: 120_000,
} as const;
