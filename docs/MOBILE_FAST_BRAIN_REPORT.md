# Mobile Fast Brain — Integration & Parity Report

**To:** EdgeCloud-DF (ML) repository team
**From:** Mobile app team (BimodalApp)
**Date:** 2026-06-11
**Repo / branch:** `BimodalApp` @ `feat/fast-brain-detection`
**Spec implemented:** `docs/MOBILE_YOLO_INTEGRATION.md` (Expo managed path, §7)

---

## 1. TL;DR

- The **on-device Fast Brain is fully implemented and running** in a standalone
  Android build (EAS preview APK). The whole pipeline executes on the phone:
  frame extraction → face detection → lip crop → TFLite inference → mean
  confidence → cascade gate → (optional) cloud escalation.
- **Verdicts agree with the desktop model** on every video we could analyze
  (real → real, fake → fake). For the product's purpose (classify real vs fake)
  the mobile build behaves correctly.
- **Numeric parity (§9.3) does NOT yet pass.** Mobile `clip_fake_confidence` is
  "squashed toward the middle" vs desktop — roughly **±0.2** off on several clips —
  **except** where on-device face detection is clean, in which case it matches the
  desktop almost exactly (video 5: **0.83 mobile vs 0.823 desktop**).
- The evidence points to a **face-detection / lip-crop-geometry difference**
  between the mobile detector (Google ML Kit) and whatever detector the desktop
  pipeline uses — **not** a model, color, normalization, or class-index bug
  (those would invert or randomize verdicts; they don't).
- We need a few answers from you (Section 7) to close the parity gap.

---

## 2. What we built

A self-contained detection module under `src/detection/`, wired into the existing
UI. No detection logic existed before; this is all new.

| File | Responsibility |
|---|---|
| `constants.ts` | The §11 contract constants (verbatim). |
| `frameExtractor.ts` | 8 evenly-spaced frames via `expo-video-thumbnails`. |
| `faceDetector.ts` | Wraps ML Kit; returns pixel-space face boxes (or `[]`). |
| `lipCropper.ts` | §4.2 lip geometry → crop → resize 224×224 → base64 JPEG. |
| `fastBrain.ts` | Loads the TFLite model; runs inference; means the per-frame fake probs. |
| `detectionService.ts` | Cascade gate (>0.80), cloud client, fallback verdicts. |

**Cascade flow (matches §1):**

```
pick video → 8 frames → ML Kit face (largest) → lip crop (224²) → TFLite per frame
          → mean(fake prob) = clip_fake_confidence
          → conf > 0.80 ? instant on-device "Deepfake"
                        : cloud enabled & reachable ? Deep Brain verdict + Grad-CAM
                                                    : on-device verdict (conf > 0.50)
```

The Deep Brain API base URL is a **runtime setting** (Settings screen), never
hardcoded, per spec §2.

---

## 3. Contract compliance (§4 / §11)

All confirmed implemented exactly as specified:

| Constant | Spec | Mobile |
|---|---|---|
| Frames per video | 8, evenly spaced first→last | ✅ `t_i = D·i/7` |
| Input size | 224×224 NHWC float32 | ✅ |
| Normalization | ÷255 → [0,1] | ✅ |
| Channel order | **RGB** | ✅ (jpeg-js RGBA → drop A, keep RGB) |
| **Fake class index** | **0** | ✅ `output[0][0]` |
| Lip crop | y 0.55→0.92, 0.10 x-pad, squared, clamped | ✅ exact math |
| Cascade threshold | 0.80 | ✅ |
| Binary threshold | 0.50 | ✅ |

The fact that **verdicts come out correct** is strong evidence these are right —
an RGB/BGR swap, wrong class index, or missing normalization would produce
inverted or random verdicts, which we do not see.

---

## 4. Environment-driven implementation decisions

The spec snippets were written for an earlier Expo SDK and bare-RN libs. On this
project (Expo SDK 56, RN 0.85, New Architecture) several APIs had moved. None of
these change the §4 contract; documenting them so you have the full picture:

1. **Face detector:** `@infinitered/react-native-mlkit-face-detection` (config-
   plugin-compatible Google ML Kit; `expo-face-detector` was removed after SDK 50).
   Initially `performanceMode: 'fast'`, now **`'accurate'` + `minFaceSize: 0.05`**.
2. **Crop + base64:** `expo-image-manipulator` context API
   (`manipulate().crop().resize().renderAsync().saveAsync({ base64:true })`). We
   take base64 directly from the manipulator instead of reading the file back,
   because SDK 56's `FileSystem.readAsStringAsync` throws at runtime.
3. **TFLite:** `react-native-fast-tflite` **v3** — its `run()` takes/returns
   `ArrayBuffer[]` (not nested typed arrays), so we pass `Float32Array.buffer` and
   read the output via `new Float32Array(out)`.
4. **Model loading (important):** passing `require('…fast_brain.tflite')` straight
   to `loadTensorflowModel` works in a dev build but **crashes in a standalone APK**
   with `MalformedURLException: no protocol: assets_models_fast_brain`. Fixed by
   resolving the bundled asset to a real `file://` URI via **`expo-asset`** and
   passing `{ url }`. (Flagging in case other mobile integrations hit this.)
5. **Frames:** `expo-video-thumbnails` (no ffmpeg). Note this yields a *thumbnail*
   near each timestamp — see open question 7.3.

**Build/test note:** Metro live-reload was unreliable on the dev machine
(firewall/network), so the device kept running a stale cached bundle. The reliable
test channel turned out to be a **fresh EAS preview APK** per change. Mentioning so
you set the same expectation when reproducing.

---

## 5. Parity test results (§9.3)

Cloud disabled, so every mobile number below is the **pure on-device
`clip_fake_confidence`** (mean fake prob over the 8 frames, before thresholding).

| # | Truth | Desktop `confidence_fake` | Mobile `clip_fake_confidence` | Δ | Verdict match |
|---|---|---|---|---|---|
| 1 | REAL | 0.182 | 0.39 | **+0.21** | ✅ both Real |
| 2 | REAL | 0.494 | *no face detected* | — | ⚠️ mobile could not analyze |
| 3 | FAKE | 1.000 | 0.79 | **−0.21** | ✅ both Fake |
| 4 | FAKE | 0.998 | 0.79 | **−0.21** | ✅ both Fake |
| 5 | FAKE | 0.823 | **0.83** | **+0.007** | ✅ both Fake |

**Two readings of this data:**

- ✅ **Classification is correct.** Every clip the phone could analyze got the same
  real/fake verdict as desktop.
- ❌ **Numeric parity fails** the ±0.05–0.10 tolerance on clips 1, 3, 4 (~0.2 off),
  and clip 2 produced no usable face at all.

**The key clue — video 5.** When the phone's face detection lands cleanly, the
confidence matches the desktop almost exactly (0.83 vs 0.823). So the model and
preprocessing math are right; the divergence tracks with face detection.

**The "squash toward the middle" pattern** (real pushed up 0.18→0.39, strong fakes
pushed down 1.0→0.79) is consistent with some frames using the **no-face fallback
box** (§4.2 step 3) instead of a true face crop, which produces a roughly neutral
(~0.6) score that drags the average toward the center.

> Note: upgrading ML Kit from `fast` to `accurate` + lowering `minFaceSize` did
> **not** move the numbers. That suggests the issue may be less "ML Kit misses the
> face entirely" and more **"ML Kit finds a face but its bounding box differs from
> the desktop detector's, so the derived lip crop is offset"** — which would shift
> the confidence even with a face present. The on-device build now reports
> `faces: X/8` per clip (see Section 9) to distinguish these two cases; we will
> attach those counts in a follow-up.

---

## 6. Root-cause hypotheses (ranked)

1. **Face-box convention mismatch (most likely).** ML Kit's bounding box may be
   tighter/looser or vertically offset vs the desktop detector. Since the lip crop
   is derived as fractions of the face box (y 0.55→0.92), even a small box
   difference shifts the mouth ROI and changes the score. This is the spec's #1
   listed cause of confidence divergence (§9.3 step 5, §10).
2. **No-face fallback contamination.** Frames where ML Kit returns nothing fall
   back to the fixed center box, polluting the mean. (Video 2 = total failure.)
3. **Frame source difference.** `expo-video-thumbnails` returns a thumbnail near
   each timestamp, which may not be the exact decoded frame the desktop samples.
4. **JPEG re-encoding.** The crop is re-encoded to JPEG before decode; desktop may
   feed raw/PNG pixels. Minor, but additive.

Ruled out: RGB/BGR, class index, normalization, input size (verdicts are correct
and video 5 matches to 3 decimals).

---

## 7. Open questions for the ML team

These will let us close the gap quickly:

1. **Which face detector does `fast_brain/prepare_data.py` use?** (library + model
   + version) and **what is its bounding-box convention** — does the box include
   forehead/hair, and where are its top/bottom relative to the face? If we know how
   it differs from ML Kit, we can apply a calibration offset to the box before the
   lip-crop math.
2. **No-face handling on desktop:** when the detector finds no face in a frame, does
   the desktop pipeline use the fixed fallback box, skip the frame, or drop the
   whole clip? We want to match this exactly for averaging.
3. **Frame sampling:** does desktop decode exact frames at `t_i = D·i/7`, or sample
   nearest keyframes? Any resizing/letterboxing before face detection?
4. **Input pixels:** is the model fed raw RGB float32 [0,1] with no JPEG round-trip?
   (We re-encode crops to JPEG; want to know if that's a source of drift.)
5. **Tolerance / acceptance:** is **verdict-level agreement sufficient** for the
   product, or is numeric `clip_fake_confidence` parity (±0.05–0.10) required?
6. **Reference crops (very helpful):** could you export the **224×224 lip crops**
   the desktop pipeline produces for 1–2 frames of any test clip? A pixel diff
   against our crops would instantly confirm or rule out the geometry hypothesis.

---

## 8. Recommended next steps

**Mobile side:**
- Capture and report `faces: X/8` for the 5 clips (now shown in-app) to confirm
  whether the gap is detection-rate or box-geometry.
- Once (7.1) is answered, apply a face-box calibration offset so the ML Kit box
  matches the desktop detector's, then re-run parity.
- Consider excluding fallback-box frames from the mean if desktop also skips them
  (pending 7.2).
- Optionally raise thumbnail resolution / try exact-frame decode if (7.3) matters.

**ML side:**
- Answer Section 7, especially the detector identity (7.1) and a couple of
  reference crops (7.6).
- Re-run `confidence_fake` on the agreed 5-clip set so we always compare like for
  like after each mobile change.

**Joint / later:**
- **Cloud (Deep Brain) path is untested.** The team's Deep Brain runs on a *local*
  server unreachable from the phone. To test the cloud verdict + Grad-CAM, expose
  it via a LAN IP (same Wi-Fi) or an ngrok URL and set it in the app's Settings.
- Re-run the full §9 test plan after parity alignment.
- Optional `int8` quantization for speed later — would require re-running parity.

---

## 9. How to build, test, and reproduce

- **Model:** `assets/models/fast_brain.tflite` (float32 export, §3), bundled via a
  `tflite` asset extension in `metro.config.js`.
- **Build a standalone APK:** `eas build --profile preview --platform android`
  (installs directly, no Metro needed — the reliable test path).
- **Parity readout:** with cloud off, the result screen shows a `diag-3` box with
  `clip_fake_confidence` (3 dp), `faces: X/8`, `used: Y/8`, and per-frame scores.
  These are the numbers to compare against desktop.
- **Definition of done (per spec):** §9.3 parity within ±0.05–0.10 on 5 clips.
  Current status: **verdicts pass; numeric parity pending the items in Section 7.**

---

## 10. Appendix — versions

- Expo SDK 56, React Native 0.85, React 19, TypeScript 6 (New Architecture on).
- `react-native-fast-tflite` 3.x (+ `react-native-nitro-modules`), `expo-asset`,
  `expo-image-manipulator`, `expo-video-thumbnails`, `expo-image-picker`,
  `@infinitered/react-native-mlkit-face-detection` 5.x, `jpeg-js`, `buffer`,
  `axios`.
- Constants (from `src/detection/constants.ts`): frames 8, input 224,
  lipY 0.55–0.92, lipPad 0.10, fakeClassIndex 0, cascade 0.80, binary 0.50.
