import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { DESIGN } from '../theme/designSystem';
import { loadFastBrain } from '../detection/fastBrain';
import { runDetection, Outcome } from '../detection/detectionService';

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
  // StrictMode / re-render guard so we never launch the cascade twice.
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;

    (async () => {
      if (!videoUri) {
        Alert.alert('No video', 'No clip was provided to analyze.');
        onNavigate('UPLOAD');
        return;
      }

      try {
        setStatusText('Loading on-device model...');
        await loadFastBrain();

        setStatusText('Fast Brain: scanning lip regions across 8 frames...');
        const outcome = await runDetection(videoUri, {
          cloudEnabled,
          apiBaseUrl,
          durationMs: durationMs ?? 0,
        });
        if (cancelled) return;

        if (outcome.verdict === 'Unknown') {
          Alert.alert(
            'Could not analyze',
            outcome.note ?? 'No usable face was found in the video.',
          );
          onNavigate('UPLOAD');
          return;
        }

        // Route by the real verdict, carrying the full outcome to the result screen.
        onNavigate(outcome.verdict === 'Deepfake' ? 'DEEPFAKE' : 'AUTHENTIC', {
          outcome,
        });
      } catch (e) {
        if (cancelled) return;
        console.error('[DeepBrainScreen] analysis failed:', e);
        Alert.alert(
          'Analysis failed',
          'Something went wrong running the detector. Make sure you are on an EAS dev build with the model bundled.',
        );
        onNavigate('UPLOAD');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.bg }]}>
      <ActivityIndicator size="large" color={DESIGN.colors.coral} style={styles.loader} />
      <Text style={[styles.title, { color: currentTheme.text || '#FFFFFF' }]}>ANALYZING MEDIA</Text>
      <Text style={styles.subtitle}>{statusText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loader: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: DESIGN.colors.textMuted,
    textAlign: 'center',
  },
});
