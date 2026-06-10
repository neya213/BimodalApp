# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

<!--
  DRAFT for the MOBILE repo's AGENTS.md.
  In the mobile repo, CLAUDE.md is just `@AGENTS.md` (an import), so AGENTS.md is
  the single source of truth that Claude Code AND other agents read. APPEND this
  section to AGENTS.md — do NOT touch CLAUDE.md. Keep it short; it loads every session.
-->

## Fast Brain deepfake detection — feature spec

The on-device deepfake detector ("Fast Brain") is specified in
**`docs/MOBILE_YOLO_INTEGRATION.md`**. That document is the source of truth for this
feature. Read it before touching any `src/detection/` code.

**Stack:** React Native + Expo (managed) + TypeScript, built with EAS.
This is **not** bare React Native — follow §7 starting at **§7.0** (the Expo path).
Expo Go cannot run this feature; it requires an **EAS development build**.

### Non-negotiable constants (silent failure if wrong)

These come from the ML repo (`shared/config.py`, `fast_brain/prepare_data.py`).
A mismatch produces **wrong results with no error**. Do not "simplify" them.

| Constant | Value | Note |
|---|---|---|
| Frames per video | 8 | evenly spaced, first→last |
| Input size | 224×224 | NHWC, float32 |
| Pixel normalization | divide by 255 → [0,1] | required |
| Channel order | **RGB** | NOT BGR |
| **Fake class index** | **0** | NOT 1 — Ultralytics sorts `fake` < `real` |
| Lip crop | y 0.55→0.92 of face box, 0.10 x-pad, squared | exact math in §4.2 |
| Cascade threshold | 0.80 | `conf > 0.80` → instant on-device "Deepfake" |
| Binary threshold | 0.50 | cloud-disabled fallback verdict |

### Expo module choices (use these, not the bare-RN libs)

- Frame extraction → `expo-video-thumbnails` (NOT ffmpeg-kit — retired)
- Crop + resize → `expo-image-manipulator`
- File read → `expo-file-system`
- Video pick (+ duration) → `expo-image-picker`
- TFLite → `react-native-fast-tflite` (+ config plugin in `app.json`)
- Face detection → config-plugin-compatible ML Kit (§7.0.1); fallback box if none
- `buffer` polyfill required for `jpeg-js` (`import { Buffer } from 'buffer'`)

### Definition of done

The build is not done until the **§9.3 parity test passes**: mobile
`clip_fake_confidence` must match the desktop model within ≈±0.05–0.10 on 5 test
videos. The API base URL must be a configurable setting — never hardcoded.

### What I (the human) handle, not Claude Code

- Exporting `fast_brain.tflite` from the ML repo.
- `eas build` / device install / Expo account auth.
- Supplying the Deep Brain API URL.
