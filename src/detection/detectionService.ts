// §1 / §4.6 / §7.6 — the cascade orchestrator.
//
//   conf > 0.80                  → instant on-device "Deepfake" (no cloud)
//   cloud enabled & reachable    → Deep Brain verdict + Grad-CAM
//   cloud enabled but unreachable→ on-device fallback (conf > 0.50)
//   cloud disabled               → on-device verdict (conf > 0.50)
//   no usable frame              → "Unknown"

import axios from 'axios';
import { FastBrain as C } from './constants';
import { analyze } from './fastBrain';

export type Source = 'onDeviceFast' | 'cloudDeep' | 'cloudFallback';

export interface Outcome {
  verdict: 'Deepfake' | 'Real' | 'Unknown';
  confidence: number;
  source: Source;
  gradCamBase64?: string;
  visualScore?: number;
  syncScore?: number;
  note?: string;
}

interface DeepBrainResponse {
  verdict: 'Deepfake' | 'Real';
  confidence: number;
  visual_score?: number;
  sync_score?: number;
  grad_cam?: string;
}

/** POSTs the video to {baseUrl}/predict. Returns null on any failure (§6.6/§7.6). */
async function callDeepBrain(
  videoUri: string,
  baseUrl: string,
): Promise<DeepBrainResponse | null> {
  try {
    const form = new FormData();
    // RN FormData file shape — uri/name/type.
    form.append('video', {
      uri: videoUri,
      name: 'clip.mp4',
      type: 'video/mp4',
    } as any);

    const { data, status } = await axios.post<DeepBrainResponse>(
      `${baseUrl}${C.apiPredictPath}`,
      form,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: C.apiTimeoutMs,
      },
    );
    if (status !== 200) return null;
    return data;
  } catch {
    return null;
  }
}

export interface RunOptions {
  cloudEnabled: boolean;
  apiBaseUrl: string;
  durationMs: number;
}

export async function runDetection(
  videoUri: string,
  opts: RunOptions,
): Promise<Outcome> {
  const conf = await analyze(videoUri, opts.durationMs);

  if (conf == null) {
    return {
      verdict: 'Unknown',
      confidence: 0,
      source: 'onDeviceFast',
      note: 'No face / unusable video',
    };
  }

  // Cascade gate (§4.6): a clear fake never touches the network.
  if (conf > C.cascadeThreshold) {
    return { verdict: 'Deepfake', confidence: conf, source: 'onDeviceFast' };
  }

  if (opts.cloudEnabled && opts.apiBaseUrl) {
    const r = await callDeepBrain(videoUri, opts.apiBaseUrl);
    if (r) {
      return {
        verdict: r.verdict,
        confidence: r.confidence,
        source: 'cloudDeep',
        gradCamBase64: r.grad_cam,
        visualScore: r.visual_score,
        syncScore: r.sync_score,
      };
    }
    // Cloud failed — fall back to the on-device verdict (§4.6, §9.1 #5).
    return {
      verdict: conf > C.binaryThreshold ? 'Deepfake' : 'Real',
      confidence: conf,
      source: 'cloudFallback',
      note: 'Cloud unavailable — on-device result',
    };
  }

  // Cloud disabled — on-device binary verdict (§4.6).
  return {
    verdict: conf > C.binaryThreshold ? 'Deepfake' : 'Real',
    confidence: conf,
    source: 'onDeviceFast',
  };
}
