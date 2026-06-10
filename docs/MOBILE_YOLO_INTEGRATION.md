# Mobile Fast Brain Integration — Detailed Implementation Guide

> **Who this is for.** This is a complete, follow-through implementation brief for an
> AI coding assistant (Claude Code) or a developer working **inside the mobile app
> repository**. It tells you exactly how to add **on-device YOLO deepfake detection
> (the "Fast Brain")** to the existing mobile frontend and escalate hard cases to the
> cloud "Deep Brain" REST API.
>
> The mobile frontend currently has **UI screens only (a mockup)** — no detection
> logic exists. Your job is to build the entire detection pipeline and wire it into
> the existing screens.

---

## How to use this document

1. Read §1 (big picture) and §4 (the contract) fully before writing any code.
2. **Detect the framework** (§5) and follow **only** the matching section:
   §6 for Flutter, §7 for React Native.
3. Work through the **task checklist** in §8 in order.
4. Validate against §9 (testing & parity). The build is not "done" until the
   parity test passes.
5. Keep §4 and §11 open at all times — those values must match exactly.

> ⚠️ **Golden rule:** the on-device preprocessing must reproduce the training
> pipeline *exactly*. A mismatch does not throw an error — it silently makes the
> model wrong. When in doubt, run the parity test (§9.3).

---

## 1. The big picture

```
[ Mobile app — THIS REPO ]                         [ Cloud server — separate repo ]
 ┌──────────────────────────────┐
 │ 1. Record / pick a video     │
 │ 2. Extract 8 frames          │
 │ 3. Detect face → crop lips   │
 │ 4. Run YOLO (TFLite) per fr. │
 │ 5. mean(fake prob) = conf    │
 └──────────────┬───────────────┘
                │
   conf > 0.80? │
        ┌───────┴────────┐
       YES               NO
        │                 │
        ▼                 ▼  POST video        ┌──────────────────────────┐
 "DEEPFAKE" alert     ───────────────────────► │ Deep Brain REST API       │
 (instant, no cloud)                           │ returns verdict + heatmap │
                      ◄─────── JSON ─────────── └──────────────────────────┘
                                │
                                ▼
                      Show verdict + Grad-CAM heatmap
```

**Your deliverable:** steps 1–5 on the device, the `> 0.80` cascade gate, the cloud
call for the `NO` branch, the fallback when the cloud is unreachable, and wiring all
of it into the existing UI.

---

## 2. What you are given

| Input | Source | Notes |
|---|---|---|
| `fast_brain.tflite` | Exported from the ML repo (§3) | YOLOv11-Nano lip classifier. Goes in app assets. |
| Deep Brain API base URL | Provided at runtime (ngrok / Colab / LAN IP) | Must be a **configurable setting**, never hardcoded. |
| This document | — | The exact contract to implement. |

---

## 3. Producing the model file (run once, in the ML repo)

In the **EdgeCloud-DF (ML) repo**, with its virtualenv active:

```bash
yolo export model=checkpoints/fast_brain_best.pt format=tflite imgsz=224
# Output: checkpoints/fast_brain_best_saved_model/fast_brain_best_float32.tflite
```

Rename it to `fast_brain.tflite` and copy into the mobile app:
- **Flutter:** `assets/models/fast_brain.tflite`
- **React Native:** `assets/models/fast_brain.tflite`

> Keep the **float32** export first (identical accuracy to the desktop model).
> Only try `int8=True` quantization later if you need more speed — and re-run the
> parity test (§9.3) if you do, because quantization shifts the numbers slightly.

---

## 4. THE CONTRACT — match exactly

### 4.1 Frame sampling
- Extract **8 frames**, evenly spaced from the first to the last frame of the video.
- Timestamp of frame *i* (0-indexed) for a video of duration `D` seconds:
  `t_i = D * i / 7` for `i = 0..7` (so `t_0 = 0`, `t_7 = D`).

### 4.2 Face detection + lip crop (per frame)
Given a frame image of size `W × H`:

1. Detect faces with the platform face detector (**Google ML Kit Face Detection**).
2. Choose the **largest** face by bounding-box area.
3. If **no face** is detected, use this fixed fallback box:
   ```
   face_x = W / 4 ;  face_y = H / 4 ;  face_w = W / 2 ;  face_h = H / 2
   ```
4. Compute the raw lip box from the face box `(face_x, face_y, face_w, face_h)`:
   ```
   y1  = face_y + 0.55 * face_h
   y2  = face_y + 0.92 * face_h
   pad = 0.10 * face_w
   x1  = face_x - pad
   x2  = face_x + face_w + pad
   ```
5. **Square it** (center-preserving), so the crop isn't distorted on resize:
   ```
   side = max(x2 - x1, y2 - y1)
   cx   = (x1 + x2) / 2
   cy   = (y1 + y2) / 2
   x1   = cx - side / 2 ;  y1 = cy - side / 2
   x2   = x1 + side     ;  y2 = y1 + side
   ```
6. **Clamp** `x1,y1,x2,y2` to `[0, W]` / `[0, H]`. If the box is empty after
   clamping, skip the frame.
7. Crop and **resize to 224 × 224**.

### 4.3 Model input tensor
- Shape **`[1, 224, 224, 3]`** (NHWC), dtype **float32**.
- Pixel values normalized to **[0, 1]** (divide each channel by 255).
- Channel order: **RGB** (not BGR).

### 4.4 Model output — ⚠️ READ CAREFULLY
- Output shape `[1, 2]`: two class probabilities.
- **`index 0 = "fake"`, `index 1 = "real"`.**
  Ultralytics sorts class folder names alphabetically, and `fake` < `real`.
- **This is the opposite of the usual convention. Do NOT assume index 1 = fake.**
- Per-frame fake probability = `output[0][0]`.
- The exported `.tflite` carries the class names in its metadata. If your TFLite
  library can read metadata, confirm the index of `"fake"` from it rather than
  trusting this note.

### 4.5 Clip confidence
```
clip_fake_confidence = mean(fake_prob_of_each_of_the_8_frames)
```
If a frame was skipped (no usable crop), average over the frames you did get. If
**zero** frames were usable, treat it as an error (show "could not analyze").

### 4.6 Thresholds (mirror `shared/config.py`; keep configurable)
| Constant | Value | Meaning |
|---|---|---|
| `CASCADE_THRESHOLD` | **0.80** | `conf > 0.80` → instant on-device "Deepfake", skip cloud. |
| `BINARY_THRESHOLD` | **0.50** | Cloud-disabled fallback: "Deepfake" when `conf > 0.50`. |

---

## 5. Detect the framework first

| If the repo contains… | Framework | Use section |
|---|---|---|
| `pubspec.yaml` | **Flutter** | §6 |
| `app.json` **+** `eas.json`, and `package.json` lists `expo` | **React Native + Expo (managed)** | §7 — **read §7.0 first** |
| `package.json` with `"react-native"` but **no** `expo` | **React Native (bare CLI)** | §7 |

Implement **only** the matching section.

> **This project is Expo managed.** The mobile repo contains `App.tsx`, `app.json`,
> `eas.json`, `index.ts`, and `tsconfig.json` — i.e. **React Native + Expo +
> TypeScript, built with EAS**. Follow §7, but start with the Expo callout in §7.0:
> it swaps the bare-RN native modules (which do **not** work in Expo Go) for the
> Expo-native equivalents and explains the development-build requirement.

---

## 6. FLUTTER IMPLEMENTATION

### 6.1 Dependencies — add to `pubspec.yaml`

```yaml
dependencies:
  tflite_flutter: ^0.11.0          # on-device TFLite inference
  google_mlkit_face_detection: ^0.13.0
  ffmpeg_kit_flutter_new: ^1.6.0   # frame extraction (original ffmpeg_kit was retired)
  image: ^4.2.0                    # crop / resize / pixel access (pure Dart)
  image_picker: ^1.1.2             # pick or record a video
  http: ^1.2.0                     # cloud API call
  path_provider: ^2.1.0            # temp dir for extracted frames

flutter:
  assets:
    - assets/models/fast_brain.tflite
```

Run `flutter pub get`. (Verify the latest versions; the APIs below match these majors.)

### 6.2 Constants — `lib/detection/constants.dart`

```dart
class FastBrainConstants {
  static const int framesPerVideo   = 8;
  static const int inputSize        = 224;
  static const double lipYStart     = 0.55;
  static const double lipYEnd       = 0.92;
  static const double lipPadding    = 0.10;
  static const int fakeClassIndex   = 0;     // NOT 1 — Ultralytics alphabetical order
  static const double cascadeThreshold = 0.80;
  static const double binaryThreshold  = 0.50;
  static const String apiPredictPath   = '/predict';
  static const Duration apiTimeout     = Duration(seconds: 120);
}
```

### 6.3 Frame extraction — `lib/detection/frame_extractor.dart`

```dart
import 'dart:io';
import 'package:ffmpeg_kit_flutter_new/ffmpeg_kit.dart';
import 'package:ffmpeg_kit_flutter_new/ffprobe_kit.dart';
import 'package:path_provider/path_provider.dart';
import 'constants.dart';

/// Extracts 8 evenly-spaced frames from [videoPath], returns the JPG file paths.
Future<List<String>> extractFrames(String videoPath) async {
  // 1. Get duration via ffprobe.
  final info = await FFprobeKit.getMediaInformation(videoPath);
  final durationStr = info.getMediaInformation()?.getDuration();
  final double duration = double.tryParse(durationStr ?? '') ?? 0;
  if (duration <= 0) return [];

  final tmp = await getTemporaryDirectory();
  final paths = <String>[];

  for (int i = 0; i < FastBrainConstants.framesPerVideo; i++) {
    final t = duration * i / (FastBrainConstants.framesPerVideo - 1); // 0..duration
    final out = '${tmp.path}/frame_$i.jpg';
    // -ss before -i = fast seek; -frames:v 1 = one frame; -q:v 2 = high quality.
    final session = await FFmpegKit.execute(
      '-y -ss $t -i "$videoPath" -frames:v 1 -q:v 2 "$out"',
    );
    final rc = await session.getReturnCode();
    if (rc != null && rc.isValueSuccess() && File(out).existsSync()) {
      paths.add(out);
    }
  }
  return paths;
}
```

### 6.4 Face detection + lip crop — `lib/detection/lip_cropper.dart`

```dart
import 'dart:io';
import 'package:google_mlkit_face_detection/google_mlkit_face_detection.dart';
import 'package:image/image.dart' as img;
import 'constants.dart';

final _faceDetector = FaceDetector(
  options: FaceDetectorOptions(performanceMode: FaceDetectorMode.fast),
);

/// Detects the largest face, crops the lip region per the contract,
/// and returns a 224x224 [img.Image] in RGB. Returns null if unusable.
Future<img.Image?> cropLipRoi(String framePath) async {
  final bytes = await File(framePath).readAsBytes();
  final decoded = img.decodeImage(bytes);
  if (decoded == null) return null;
  final W = decoded.width, H = decoded.height;

  final faces =
      await _faceDetector.processImage(InputImage.fromFilePath(framePath));

  double fx, fy, fw, fh;
  if (faces.isEmpty) {
    fx = W / 4; fy = H / 4; fw = W / 2; fh = H / 2;             // fallback box
  } else {
    faces.sort((a, b) =>
        (b.boundingBox.width * b.boundingBox.height)
            .compareTo(a.boundingBox.width * a.boundingBox.height));
    final r = faces.first.boundingBox;
    fx = r.left; fy = r.top; fw = r.width; fh = r.height;       // largest face
  }

  // Raw lip box.
  double y1 = fy + FastBrainConstants.lipYStart * fh;
  double y2 = fy + FastBrainConstants.lipYEnd   * fh;
  final pad = FastBrainConstants.lipPadding * fw;
  double x1 = fx - pad;
  double x2 = fx + fw + pad;

  // Square it (center-preserving).
  final side = (x2 - x1) > (y2 - y1) ? (x2 - x1) : (y2 - y1);
  final cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
  x1 = cx - side / 2; y1 = cy - side / 2;
  x2 = x1 + side;     y2 = y1 + side;

  // Clamp.
  int ix1 = x1.clamp(0, W).toInt();
  int iy1 = y1.clamp(0, H).toInt();
  int ix2 = x2.clamp(0, W).toInt();
  int iy2 = y2.clamp(0, H).toInt();
  if (ix2 <= ix1 || iy2 <= iy1) return null;

  final crop = img.copyCrop(decoded,
      x: ix1, y: iy1, width: ix2 - ix1, height: iy2 - iy1);
  return img.copyResize(crop,
      width: FastBrainConstants.inputSize, height: FastBrainConstants.inputSize);
}
```

### 6.5 TFLite inference — `lib/detection/fast_brain.dart`

```dart
import 'package:tflite_flutter/tflite_flutter.dart';
import 'package:image/image.dart' as img;
import 'constants.dart';
import 'frame_extractor.dart';
import 'lip_cropper.dart';

class FastBrain {
  late final Interpreter _interpreter;

  Future<void> load() async {
    _interpreter =
        await Interpreter.fromAsset('assets/models/fast_brain.tflite');
  }

  /// Builds the [1,224,224,3] float32 input from an RGB image, [0,1] normalized.
  List _toInput(img.Image im) {
    final n = FastBrainConstants.inputSize;
    return [
      List.generate(n, (y) => List.generate(n, (x) {
            final p = im.getPixel(x, y);
            return [p.r / 255.0, p.g / 255.0, p.b / 255.0];
          }))
    ];
  }

  /// Runs one 224x224 RGB crop, returns the FAKE probability.
  double _inferOne(img.Image crop) {
    final input = _toInput(crop);
    final output = List.filled(1 * 2, 0.0).reshape([1, 2]);
    _interpreter.run(input, output);
    return (output[0][FastBrainConstants.fakeClassIndex] as num).toDouble();
  }

  /// Full Fast Brain pass over a video. Returns the mean fake confidence,
  /// or null if no frame was usable.
  Future<double?> analyze(String videoPath) async {
    final frames = await extractFrames(videoPath);
    final probs = <double>[];
    for (final f in frames) {
      final crop = await cropLipRoi(f);
      if (crop != null) probs.add(_inferOne(crop));
    }
    if (probs.isEmpty) return null;
    return probs.reduce((a, b) => a + b) / probs.length;
  }
}
```

### 6.6 Cloud API client — `lib/detection/deep_brain_api.dart`

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'constants.dart';

class DeepBrainResult {
  final String verdict;       // "Deepfake" | "Real"
  final double confidence;
  final double visualScore;
  final double syncScore;
  final String gradCamBase64; // PNG, base64
  DeepBrainResult(this.verdict, this.confidence, this.visualScore,
      this.syncScore, this.gradCamBase64);
}

/// POSTs the video to {baseUrl}/predict. Returns null on any failure.
Future<DeepBrainResult?> callDeepBrain(String videoPath, String baseUrl) async {
  try {
    final uri = Uri.parse('$baseUrl${FastBrainConstants.apiPredictPath}');
    final req = http.MultipartRequest('POST', uri)
      ..files.add(await http.MultipartFile.fromPath('video', videoPath));
    final streamed = await req.send().timeout(FastBrainConstants.apiTimeout);
    if (streamed.statusCode != 200) return null;
    final body = jsonDecode(await streamed.stream.bytesToString());
    return DeepBrainResult(
      body['verdict'], (body['confidence'] as num).toDouble(),
      (body['visual_score'] as num).toDouble(),
      (body['sync_score'] as num).toDouble(),
      body['grad_cam'] ?? '',
    );
  } catch (_) {
    return null;
  }
}
```

### 6.7 Cascade orchestrator — `lib/detection/detection_service.dart`

```dart
import 'constants.dart';
import 'fast_brain.dart';
import 'deep_brain_api.dart';

enum Source { onDeviceFast, cloudDeep, cloudFallback }

class DetectionOutcome {
  final String verdict;         // "Deepfake" | "Real" | "Unknown"
  final double confidence;
  final Source source;
  final String? gradCamBase64;
  final String? note;
  DetectionOutcome(this.verdict, this.confidence, this.source,
      {this.gradCamBase64, this.note});
}

class DetectionService {
  final FastBrain fastBrain;
  DetectionService(this.fastBrain);

  Future<DetectionOutcome> run(
      String videoPath, {required bool cloudEnabled, required String apiBaseUrl}) async {
    final conf = await fastBrain.analyze(videoPath);
    if (conf == null) {
      return DetectionOutcome('Unknown', 0, Source.onDeviceFast,
          note: 'No face / unusable video');
    }

    // Cascade gate.
    if (conf > FastBrainConstants.cascadeThreshold) {
      return DetectionOutcome('Deepfake', conf, Source.onDeviceFast);
    }

    if (cloudEnabled) {
      final r = await callDeepBrain(videoPath, apiBaseUrl);
      if (r != null) {
        return DetectionOutcome(r.verdict, r.confidence, Source.cloudDeep,
            gradCamBase64: r.gradCamBase64);
      }
      // Cloud failed — fall back to on-device.
      final v = conf > FastBrainConstants.binaryThreshold ? 'Deepfake' : 'Real';
      return DetectionOutcome(v, conf, Source.cloudFallback,
          note: 'Cloud unavailable — on-device result');
    }

    final v = conf > FastBrainConstants.binaryThreshold ? 'Deepfake' : 'Real';
    return DetectionOutcome(v, conf, Source.onDeviceFast);
  }
}
```

### 6.8 Wiring into the existing UI
- On app start (or first use): `final fb = FastBrain(); await fb.load();`
  (await it before the first analysis; show a spinner).
- On the existing **"Analyse"** button: call `DetectionService(fb).run(...)`.
- Render `DetectionOutcome`: verdict badge (red = Deepfake, green = Real), the
  confidence, the `source` label, and — when `gradCamBase64` is present —
  `Image.memory(base64Decode(outcome.gradCamBase64!))`.
- Put the **API base URL** and a **"use cloud" toggle** in a settings screen.

---

## 7. REACT NATIVE IMPLEMENTATION

### 7.0 Expo managed workflow — READ THIS FIRST (this project)

This repo is **Expo managed** (`app.json` + `eas.json`, no `ios/` or `android/`
folders). Two consequences drive every choice below:

1. **Expo Go cannot run this app.** On-device TFLite and ML Kit are *native*
   modules that aren't in the Expo Go runtime. You must build a **development
   build** (a.k.a. dev client) with EAS, which the repo is already configured for:

   ```bash
   npx expo install expo-dev-client
   eas build --profile development --platform android   # or ios
   # install the resulting build on the device, then:
   npx expo start --dev-client
   ```

2. **Use Expo-native modules instead of the bare-RN ones.** They need no manual
   `pod install` and are wired by config plugins. The bare-RN libraries the older
   draft listed (`ffmpeg-kit-react-native`, `@react-native-community/image-editor`,
   `react-native-fs`) are replaced as follows:

   | Need | ❌ bare-RN lib (don't use here) | ✅ Expo module |
   |---|---|---|
   | Frame extraction | `ffmpeg-kit-react-native` (retired) | **`expo-video-thumbnails`** (no ffmpeg needed) |
   | Crop + resize | `@react-native-community/image-editor` | **`expo-image-manipulator`** |
   | File read (base64) | `react-native-fs` | **`expo-file-system`** |
   | Pick / record video + get duration | — | **`expo-image-picker`** |
   | On-device TFLite | `react-native-fast-tflite` | **`react-native-fast-tflite`** (keep — add its config plugin to `app.json`) |
   | Face detection | `@react-native-ml-kit/face-detection` | a **config-plugin-compatible ML Kit** (see §7.0.1) |

#### 7.0.1 Face detection in Expo — the one rough edge

`expo-face-detector` was removed (deprecated after SDK 50), so there is **no
first-party Expo face detector**. Use a config-plugin-compatible ML Kit face
detector (e.g. an Infinite Red `react-native-mlkit` face-detection module) and add
its plugin to `app.json`. Wrap whatever you choose behind a single helper:

```ts
// src/detection/faceDetector.ts
// Returns faces as pixel-space boxes [{ x, y, width, height }], or [] if none.
export async function detectFaces(
  imageUri: string,
): Promise<{ x: number; y: number; width: number; height: number }[]> { /* ... */ }
```

If no Expo-compatible detector integrates cleanly in time, the contract's
**no-face fallback box (§4.2 step 3) keeps the pipeline running** — accuracy
degrades but nothing breaks. Flag this to the ML team and re-run the parity test
(§9.3), since the fallback box changes the crop.

#### 7.0.2 `app.json` plugins

Add the native-module config plugins so EAS includes them, e.g.:

```jsonc
{
  "expo": {
    "plugins": [
      "react-native-fast-tflite",
      "expo-image-picker"
      // + your chosen ML Kit face-detection plugin
    ]
  }
}
```

### 7.1 Dependencies (Expo)

```bash
npx expo install expo-video-thumbnails expo-image-manipulator \
    expo-file-system expo-image-picker expo-dev-client
npm i react-native-fast-tflite jpeg-js buffer axios
# + your chosen ML Kit face-detection package (see §7.0.1)
```

> `buffer` is needed because React Native has no global `Buffer` (used by `jpeg-js`
> in §7.5). Import it explicitly: `import { Buffer } from 'buffer';`.
> **Bare-RN (no Expo)?** Then ignore §7.0 and use the original native stack
> (`ffmpeg-kit-react-native` fork, `@react-native-community/image-editor`,
> `react-native-fs`) with `cd ios && pod install`. The contract (§4) is identical.

### 7.2 Constants — `src/detection/constants.ts`

```ts
export const FastBrain = {
  framesPerVideo: 8,
  inputSize: 224,
  lipYStart: 0.55,
  lipYEnd: 0.92,
  lipPadding: 0.10,
  fakeClassIndex: 0,        // NOT 1 — Ultralytics alphabetical order
  cascadeThreshold: 0.80,
  binaryThreshold: 0.50,
  apiPredictPath: '/predict',
  apiTimeoutMs: 120_000,
} as const;
```

### 7.3 Frame extraction — `src/detection/frameExtractor.ts` (Expo)

No ffmpeg. `expo-video-thumbnails` decodes one frame per timestamp natively.
`durationMs` comes from `expo-image-picker` (its video assets carry `duration` in
ms) — pass it in.

```ts
import * as VideoThumbnails from 'expo-video-thumbnails';
import { FastBrain } from './constants';

/** Returns up to 8 thumbnail URIs sampled evenly across the clip (skips failures). */
export async function extractFrames(
  videoUri: string,
  durationMs: number,
): Promise<string[]> {
  if (!durationMs || durationMs <= 0) return [];
  const uris: string[] = [];
  for (let i = 0; i < FastBrain.framesPerVideo; i++) {
    const tMs = (durationMs * i) / (FastBrain.framesPerVideo - 1); // 0..durationMs
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: Math.round(tMs), // milliseconds — matches the contract's even spacing
        quality: 1.0,
      });
      uris.push(uri);
    } catch {
      // unextractable timestamp near EOF — skip, average over the rest (§4.5)
    }
  }
  return uris;
}
```

### 7.4 Face detection + lip crop — `src/detection/lipCropper.ts` (Expo)

Uses `expo-image-manipulator` for crop+resize and the `detectFaces` helper from
§7.0.1 (so the rest of the pipeline is independent of which ML Kit you pick).

```ts
import * as ImageManipulator from 'expo-image-manipulator';
import { Image } from 'react-native';
import { FastBrain } from './constants';
import { detectFaces } from './faceDetector'; // §7.0.1 — returns pixel-space boxes

/** Returns the URI of a cropped+resized 224x224 JPG, or null if unusable. */
export async function cropLipRoi(frameUri: string): Promise<string | null> {
  const { width: W, height: H } = await new Promise<{width:number;height:number}>(
    (res, rej) => Image.getSize(frameUri, (w, h) => res({ width: w, height: h }), rej));

  const faces = await detectFaces(frameUri);

  let fx: number, fy: number, fw: number, fh: number;
  if (!faces.length) {
    fx = W / 4; fy = H / 4; fw = W / 2; fh = H / 2;             // fallback box (§4.2)
  } else {
    const f = faces.reduce((a, b) =>
      (a.width * a.height) >= (b.width * b.height) ? a : b);   // largest face
    fx = f.x; fy = f.y; fw = f.width; fh = f.height;
  }

  let y1 = fy + FastBrain.lipYStart * fh;
  let y2 = fy + FastBrain.lipYEnd   * fh;
  const pad = FastBrain.lipPadding * fw;
  let x1 = fx - pad, x2 = fx + fw + pad;

  const side = Math.max(x2 - x1, y2 - y1);
  const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
  x1 = cx - side / 2; y1 = cy - side / 2;

  const originX = Math.max(0, Math.round(x1));
  const originY = Math.max(0, Math.round(y1));
  const cw = Math.min(W - originX, Math.round(side));
  const ch = Math.min(H - originY, Math.round(side));
  if (cw <= 0 || ch <= 0) return null;

  const result = await ImageManipulator.manipulateAsync(
    frameUri,
    [
      { crop: { originX, originY, width: cw, height: ch } },
      { resize: { width: FastBrain.inputSize, height: FastBrain.inputSize } },
    ],
    { base64: false, format: ImageManipulator.SaveFormat.JPEG },
  );
  return result.uri;
}
```

> SDK 52+ deprecates `manipulateAsync` in favour of the context API
> (`ImageManipulator.manipulate(uri).crop(...).resize(...).renderAsync()`).
> Either works; keep whichever matches the SDK pinned in `package.json`.

### 7.5 TFLite inference — `src/detection/fastBrain.ts`

```ts
import { loadTensorflowModel, TensorflowModel } from 'react-native-fast-tflite';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';            // RN has no global Buffer (§7.1)
import jpeg from 'jpeg-js';
import { FastBrain as C } from './constants';
import { extractFrames } from './frameExtractor';
import { cropLipRoi } from './lipCropper';

let model: TensorflowModel | null = null;

export async function loadFastBrain() {
  model = await loadTensorflowModel(require('../../assets/models/fast_brain.tflite'));
}

/** Decode a 224x224 JPG into a Float32Array of RGB, [0,1] normalized, NHWC. */
async function toInput(cropUri: string): Promise<Float32Array> {
  const b64 = await FileSystem.readAsStringAsync(cropUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const raw = jpeg.decode(Buffer.from(b64, 'base64'), { useTArray: true }); // RGBA
  const n = C.inputSize;
  const out = new Float32Array(n * n * 3);
  for (let i = 0, j = 0; i < raw.data.length; i += 4) {
    out[j++] = raw.data[i]     / 255; // R
    out[j++] = raw.data[i + 1] / 255; // G
    out[j++] = raw.data[i + 2] / 255; // B  (skip A)
  }
  return out;
}

/** Mean fake confidence over the video, or null if no usable frame.
 *  durationMs comes from the picker (§7.3). */
export async function analyze(videoUri: string, durationMs: number): Promise<number | null> {
  if (!model) throw new Error('Fast Brain not loaded');
  const frames = await extractFrames(videoUri, durationMs);
  const probs: number[] = [];
  for (const f of frames) {
    const crop = await cropLipRoi(f);
    if (!crop) continue;
    const input = await toInput(crop);
    const output = await model.run([input]);            // output[0] = [fake, real]
    probs.push(Number(output[0][C.fakeClassIndex]));
  }
  if (!probs.length) return null;
  return probs.reduce((a, b) => a + b, 0) / probs.length;
}
```

### 7.6 Cloud client + cascade — `src/detection/detectionService.ts`

```ts
import axios from 'axios';
import { FastBrain as C } from './constants';
import { analyze } from './fastBrain';

export type Source = 'onDeviceFast' | 'cloudDeep' | 'cloudFallback';
export interface Outcome {
  verdict: 'Deepfake' | 'Real' | 'Unknown';
  confidence: number;
  source: Source;
  gradCamBase64?: string;
  note?: string;
}

async function callDeepBrain(videoPath: string, baseUrl: string) {
  try {
    const form = new FormData();
    form.append('video', { uri: videoPath, name: 'clip.mp4', type: 'video/mp4' } as any);
    const { data, status } = await axios.post(`${baseUrl}${C.apiPredictPath}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: C.apiTimeoutMs,
    });
    if (status !== 200) return null;
    return data; // { verdict, confidence, visual_score, sync_score, grad_cam }
  } catch { return null; }
}

export async function runDetection(
  videoPath: string,
  opts: { cloudEnabled: boolean; apiBaseUrl: string; durationMs: number }
): Promise<Outcome> {
  const conf = await analyze(videoPath, opts.durationMs);
  if (conf == null)
    return { verdict: 'Unknown', confidence: 0, source: 'onDeviceFast',
             note: 'No face / unusable video' };

  if (conf > C.cascadeThreshold)
    return { verdict: 'Deepfake', confidence: conf, source: 'onDeviceFast' };

  if (opts.cloudEnabled) {
    const r = await callDeepBrain(videoPath, opts.apiBaseUrl);
    if (r) return { verdict: r.verdict, confidence: r.confidence,
                    source: 'cloudDeep', gradCamBase64: r.grad_cam };
    const verdict = conf > C.binaryThreshold ? 'Deepfake' : 'Real';
    return { verdict, confidence: conf, source: 'cloudFallback',
             note: 'Cloud unavailable — on-device result' };
  }

  const verdict = conf > C.binaryThreshold ? 'Deepfake' : 'Real';
  return { verdict, confidence: conf, source: 'onDeviceFast' };
}
```

### 7.7 Wiring into the existing UI
- Call `loadFastBrain()` once at startup (await before first analysis).
- Pick the video with `expo-image-picker`; it returns the asset `uri` **and**
  `duration` (ms) — pass both on:
  ```ts
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'videos' });
  const asset = res.assets?.[0];
  const outcome = await runDetection(asset.uri, {
    cloudEnabled, apiBaseUrl, durationMs: asset.duration ?? 0,
  });
  ```
- The existing **"Analyse"** button calls `runDetection(...)` as above.
- Render the `Outcome`: red/green verdict badge, confidence, `source` label, and —
  if `gradCamBase64` exists — `<Image source={{ uri: \`data:image/png;base64,${gradCamBase64}\` }} />`.
- API base URL + cloud toggle live in a settings screen.

---

## 8. Task checklist (do in order)

```
[ ] 0. Detect framework (§5). This repo = Expo managed → follow §7 starting at §7.0.
[ ] 0b. (Expo) Make an EAS development build + install on device (§7.0); Expo Go won't work.
[ ] 1. Obtain fast_brain.tflite (§3) and place it in assets.
[ ] 2. Add dependencies (§7.1); register native-module config plugins in app.json (§7.0.2).
[ ] 3. Add the constants file (§6.2 / §7.2) — copy values from §11 verbatim.
[ ] 4. Implement frame extraction (8 evenly-spaced frames).
[ ] 5. Implement face detection + lip crop (exact geometry from §4.2).
[ ] 6. Implement TFLite inference (fake = index 0; RGB; [0,1]).
[ ] 7. Implement mean-confidence + cascade gate (> 0.80).
[ ] 8. Implement the cloud API client + fallback.
[ ] 9. Wire into the existing screens (load model, button, render verdict + heatmap).
[ ] 10. Add settings: API base URL + cloud toggle (no hardcoded URL).
[ ] 11. Run the test plan (§9). Do not call it done until parity passes.
```

---

## 9. Testing & parity (definition of done)

### 9.1 Functional tests
1. **Loads & runs** on a real device/emulator without crashing.
2. **Offline path:** with cloud disabled, analyzing a video yields a verdict using
   only the bundled model.
3. **Cascade gate:** a clear fake (conf > 0.80) shows the instant alert and makes
   **no** network request — confirm in the network inspector.
4. **Cloud path:** a borderline video triggers the POST and renders the verdict +
   decoded Grad-CAM image.
5. **Graceful failure:** with an unreachable API URL, the app falls back to the
   on-device verdict (no crash, no infinite spinner).

### 9.2 API smoke test (before testing the app)
```bash
curl <API_BASE_URL>/health
# expect: {"status": "ok", "device": "cuda"}   (or "cpu")
```

### 9.3 PARITY TEST — the most important check
Goal: prove the phone runs the *same* model as the validated desktop pipeline.

1. Pick 5 test videos (mix of real and fake).
2. **Desktop confidence** — ask the ML team to run, in the EdgeCloud-DF repo:
   `python -m fast_brain.evaluate` (or have them log `infer_fast_brain`'s
   `confidence_fake` per video).
3. **Mobile confidence** — temporarily log `clip_fake_confidence` (the mean,
   before thresholding) for the same 5 videos.
4. Compare. They should agree **within a small margin** (≈ ±0.05–0.10; minor
   differences from JPEG re-encoding and face-detector differences are expected).
5. If they **diverge widely**, the cause is almost always one of:
   - lip-crop geometry (§4.2) — most common,
   - RGB vs BGR (§4.3),
   - the fake-class index (§4.4),
   - missing [0,1] normalization (§4.3).
   Fix until they agree. **Parity passing = the build is correct.**

---

## 10. Common pitfalls (each silently produces wrong results)

| Pitfall | Symptom | Fix |
|---|---|---|
| Assuming fake = index 1 | Every verdict inverted | Fake is **index 0** (§4.4) |
| BGR instead of RGB | Verdicts random / always one class | Feed RGB (§4.3) |
| Wrong lip-crop geometry | Confidence ≠ desktop | Exact box math (§4.2) |
| No [0,1] normalization | Garbage output | Divide pixels by 255 (§4.3) |
| Not squaring before resize | Mild accuracy loss | Square the box first (§4.2 step 5) |
| Hardcoded API URL | Breaks when server moves | Make it a setting (§2) |
| Blocking the UI thread on inference | App freezes | Run analysis off the UI thread (isolate / async) |
| Forgetting to await model load | First analysis crashes | Load model before first use (§6.8 / §7.7) |
| **(Expo)** Testing in Expo Go | Native TFLite/ML Kit modules missing → crash on load | Use an **EAS dev build**, not Expo Go (§7.0) |
| **(Expo)** Forgot `Buffer` polyfill | `jpeg-js` throws `Buffer is not defined` | `import { Buffer } from 'buffer'` (§7.1, §7.5) |
| **(Expo)** Native module not in `app.json` plugins | Module not found at runtime after EAS build | Add it to `expo.plugins` (§7.0.2) |

---

## 11. Constants reference (copy verbatim)

```
FRAMES_PER_VIDEO    = 8
INPUT_SIZE          = 224
LIP_Y_START         = 0.55
LIP_Y_END           = 0.92
LIP_PADDING         = 0.10
FAKE_CLASS_INDEX    = 0        # NOT 1 — Ultralytics alphabetical order
CASCADE_THRESHOLD   = 0.80     # > this → instant on-device "Deepfake"
BINARY_THRESHOLD    = 0.50     # Fast-Brain-only verdict (cloud disabled)
API_PREDICT_PATH    = "/predict"
API_TIMEOUT_SECONDS = 120
```

---

*Source of truth: `shared/config.py`, `fast_brain/prepare_data.py`, and
`evaluation/run_eval.py` in the EdgeCloud-DF (ML) repository. The lip geometry,
frame count, class index, and thresholds are taken directly from those files. If
they change, update this document.*
