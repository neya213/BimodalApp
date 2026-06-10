import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { DESIGN } from '../theme/designSystem';
import { loadFastBrain } from '../detection/fastBrain';
import { runDetection, Outcome } from '../detection/detectionService';

// Bump when this file changes so we can confirm on-device that the latest code
// is running (shows on the loading + error screens).
const DIAG_BUILD = 'diag-3';

interface DeepBrainScreenProps {
  onNavigate: (screen: string, params?: { outcome?: Outcome }) => void;
  isDarkMode: boolean;
  videoUri?: string;
  durationMs?: number;
  cloudEnabled: boolean;
  apiBaseUrl: string;
}

export default function DeepBrainScreen({
  onNavigate,
  isDarkMode,
  videoUri,
  durationMs,
  cloudEnabled,
  apiBaseUrl,
}: DeepBrainScreenProps) {
  const currentTheme = DESIGN.theme(isDarkMode);
  const [statusText, setStatusText] = useState('Initializing Bimodal Cascade...');
  const [errorText, setErrorText] = useState<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;
    let stage = 'start';

    const fail = (e: any) => {
      if (cancelled) return;
      const msg = e?.message ? String(e.message) : String(e);
      const stack = e?.stack ? String(e.stack).split('\n').slice(0, 6).join('\n') : '';
      setErrorText(`STAGE: ${stage}\nvideo: ${videoUri ?? 'none'}\nduration(ms): ${durationMs ?? 'none'}\n\n${msg}\n\n${stack}`);
    };

    (async () => {
      if (!videoUri) {
        stage = 'input';
        fail(new Error('No video URI was passed to the analyzer.'));
        return;
      }

      try {
        stage = 'load-model';
        setStatusText('Loading on-device model...');
        await loadFastBrain();

        stage = 'analyze';
        setStatusText('Fast Brain: scanning lip regions across 8 frames...');
        const outcome = await runDetection(videoUri, {
          cloudEnabled,
          apiBaseUrl,
          durationMs: durationMs ?? 0,
        });
        if (cancelled) return;

        if (outcome.verdict === 'Unknown') {
          stage = 'no-usable-frames';
          fail(new Error(outcome.note ?? 'No usable face/frame was found in the video.'));
          return;
        }

        onNavigate(outcome.verdict === 'Deepfake' ? 'DEEPFAKE' : 'AUTHENTIC', { outcome });
      } catch (e) {
        fail(e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (errorText) {
    return (
      <View style={[styles.container, { backgroundColor: currentTheme.bg }]}>
        <ScrollView contentContainerStyle={styles.errorScroll}>
          <Text style={styles.errorTitle}>ANALYSIS FAILED</Text>
          <Text style={styles.diag}>build: {DIAG_BUILD}</Text>
          <Text selectable style={styles.errorBody}>
            {errorText}
          </Text>
        </ScrollView>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('UPLOAD')}>
          <Text style={styles.backBtnText}>Back to Upload</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.bg }]}>
      <ActivityIndicator size="large" color={DESIGN.colors.coral} style={styles.loader} />
      <Text style={[styles.title, { color: currentTheme.text || '#FFFFFF' }]}>ANALYZING MEDIA</Text>
      <Text style={styles.subtitle}>{statusText}</Text>
      <Text style={styles.diag}>build: {DIAG_BUILD}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loader: { marginBottom: 24 },
  title: { fontSize: 16, fontWeight: '700', letterSpacing: 2, marginBottom: 8 },
  subtitle: { fontSize: 14, color: DESIGN.colors.textMuted, textAlign: 'center' },
  diag: { fontSize: 11, color: DESIGN.colors.textMuted, marginTop: 16, fontFamily: 'monospace' },
  errorScroll: { flexGrow: 1, justifyContent: 'center', paddingVertical: 40 },
  errorTitle: { fontSize: 18, fontWeight: '800', color: DESIGN.colors.coral, letterSpacing: 1, marginBottom: 6 },
  errorBody: { fontSize: 13, color: '#FFD6D0', fontFamily: 'monospace', lineHeight: 18, marginTop: 12 },
  backBtn: { backgroundColor: DESIGN.colors.coral, paddingVertical: 14, borderRadius: 20, alignItems: 'center', marginTop: 12 },
  backBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
