import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { DESIGN } from '../theme/designSystem';

interface DeepBrainScreenProps {
  onNavigate: (screen: string, params?: { score: number }) => void;
  isDarkMode: boolean;
}

export default function DeepBrainScreen({ onNavigate, isDarkMode }: DeepBrainScreenProps) {
  const currentTheme = DESIGN.theme(isDarkMode);
  const [statusText, setStatusText] = useState('Initializing Bimodal Cascade...');

  useEffect(() => {
    // Stage 1: Fast Brain Pre-Screen (YOLOv11-Nano)
    const t1 = setTimeout(() => {
      setStatusText('Fast Brain: Scanning frame regions...');
    }, 1200);

    // Stage 2: Deep Brain Feature Extraction (Cloud ViT)
    const t2 = setTimeout(() => {
      setStatusText('Deep Brain: Checking audio-to-lip synchronicity...');
    }, 2500);

    // Stage 3: Resolve Threshold Verdict
    const t3 = setTimeout(() => {
      // Simulating a result: 50% chance authentic, 50% chance deepfake
      const finalScore = parseFloat((Math.random() * (0.99 - 0.60) + 0.60).toFixed(2));
      
      if (finalScore >= 0.80) {
        // High confidence manipulation -> Route to Deepfake Screen
        onNavigate('DEEPFAKE', { score: finalScore });
      } else {
        // Below threshold/Clean -> Route to Authentic Screen
        onNavigate('AUTHENTIC', { score: finalScore });
      }
    }, 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
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