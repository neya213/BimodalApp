// Let TypeScript accept `require('....tflite')` (Metro resolves these to an asset
// id at build time; react-native-fast-tflite accepts that number as a ModelSource).
declare module '*.tflite';
