# Models

Place the exported Fast Brain model here as **`fast_brain.tflite`**.

It is **not** checked into git (it's a large binary produced by the ML repo). Until
this file exists, the app will fail to bundle, because
`src/detection/fastBrain.ts` does `require('../../assets/models/fast_brain.tflite')`.

## How to produce it (run once, in the EdgeCloud-DF / ML repo)

```bash
yolo export model=checkpoints/fast_brain_best.pt format=tflite imgsz=224
# -> checkpoints/fast_brain_best_saved_model/fast_brain_best_float32.tflite
```

Rename the **float32** export to `fast_brain.tflite` and copy it into this folder.
Keep float32 first (identical accuracy to desktop); only try int8 quantization
later for speed, and re-run the §9.3 parity test if you do.

See `docs/MOBILE_YOLO_INTEGRATION.md` §3.
