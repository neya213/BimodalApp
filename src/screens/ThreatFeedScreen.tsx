import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { DESIGN } from '../theme/designSystem';

interface ThreatFeedProps {
  onNavigate: (screen: string) => void;
  isDarkMode?: boolean;
}

export default function ThreatFeedScreen({ onNavigate, isDarkMode = true }: ThreatFeedProps) {
  // Gracefully check if dark mode active, otherwise fallback gracefully
  const theme = isDarkMode ? DESIGN.colors.dark : DESIGN.colors.light;

  const threats = [
    { id: 1, title: 'Deepfake Audio Campaign', type: 'Voice Cloning', risk: 'HIGH', time: '10m ago' },
    { id: 2, title: 'Synthetic Video Injection', type: 'Face Swap', risk: 'CRITICAL', time: '1h ago' },
    { id: 3, title: 'Bimodal Bypass Attempt', type: 'Adversarial', risk: 'MEDIUM', time: '3h ago' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('HOME')}>
          <Text style={[styles.backButton, { color: theme.text }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>THREAT FEED</Text>
        <View style={{ width: 50 }} />
      </View>

      <Text style={styles.sectionLabel}>GLOBAL REAL-TIME LOGS</Text>

      {threats.map((threat) => (
        <View key={threat.id} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.threatTitle, { color: theme.text }]}>{threat.title}</Text>
            <Text style={[styles.riskBadge, { color: DESIGN.colors.coral }]}>{threat.risk}</Text>
          </View>
          <Text style={styles.threatMeta}>Type: {threat.type} • {threat.time}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  backButton: { fontSize: 14, fontWeight: '600' },
  title: { fontSize: 12, fontWeight: '800', letterSpacing: 4 },
  sectionLabel: { color: DESIGN.colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 15 },
  card: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  threatTitle: { fontSize: 15, fontWeight: '600' },
  riskBadge: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  threatMeta: { color: DESIGN.colors.textMuted, fontSize: 12, marginTop: 4 }
});