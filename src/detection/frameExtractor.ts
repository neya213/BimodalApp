// §4.1 / §7.3 — extract 8 evenly-spaced frames from a video.
//
// Uses expo-video-thumbnails (no ffmpeg). durationMs comes from the picker asset
// (expo-image-picker video assets carry `duration` in ms) and must be passed in.

import * as VideoThumbnails from 'expo-video-thumbnails';
import { FastBrain } from './constants';

/**
 * Returns up to 8 thumbnail URIs sampled evenly from the first to the last frame.
 * Failures (e.g. an unextractable timestamp near EOF) are skipped — §4.5 says to
 * average over the frames that did decode.
 *
 * Timestamp of frame i (0-indexed): t_i = durationMs * i / (framesPerVideo - 1),
 * so t_0 = 0 and t_7 = durationMs.
 */
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
        time: Math.round(tMs), // milliseconds
        quality: 1.0,
      });
      uris.push(uri);
    } catch {
      // skip unextractable timestamp; average over the rest (§4.5)
    }
  }
  return uris;
}
