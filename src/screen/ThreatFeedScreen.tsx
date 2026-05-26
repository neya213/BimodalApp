import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { DESIGN } from '../theme/designSystem';

export default function ThreatFeedScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.topBar}>
        <Text style={styles.logo}>BIMODAL</Text>
        <Text style={styles.alertCounter}>14 NEW</Text>
      </View>

      <Text style={styles.label}>THREAT FEED</Text>
      <Text style={styles.h1}>What we're seeing in the wild.</Text>

      <View style={styles.filterBar}>
        {['All', 'Alerts', 'Model', 'Research'].map((tab, idx) => (
          <Text key={idx} style={[styles.filterTab, idx === 0 && styles.activeTab]}>{tab}</Text>
        ))}
      </View>

      <View style={styles.pinnedCard}>
        <Text style={styles.cardTag}>• PINNED • ALERT</Text>
        <Text style={styles.cardHeader}>New evasion variant targets H.264-recompressed clips. Update to v2.4.1.</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardMetaText}>BIMODAL OPS • 12M AGO</Text>
          <Text style={styles.updateLink}>Update →</Text>
        </View>
      </View>

      <View style={styles.feedRow}>
        <Text style={styles.rowTag}>• ALERT • AP • 6H</Text>
        <Text style={styles.rowTitle}>Election-cycle deepfakes — 12 new clusters this week</Text>
      </View>

      <View style={styles.feedRow}>
        <Text style={styles.rowTag}>• TRENDING • REUTERS • 2H</Text>
        <Text style={styles.rowTitle}>Synthetic voice scams spike 38% in EU banks</Text>
      </View>

      <View style={styles.feedRow}>
        <Text style={styles.rowTag}>• MODEL • BIMODAL • 1D</Text>
        <Text style={styles.rowTitle}>Fast Brain v2.4.1 — stronger compression-resilience</Text>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={() => onNavigate('LOGIN')}>
        <Text style={styles.resetButtonText}>Logout / Restart Loop</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: DESIGN.colors.bgWhite, paddingHorizontal: 24, paddingTop: 50 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  logo: { color: DESIGN.colors.navy, fontSize: 13, fontWeight: '800', letterSpacing: 4 },
  alertCounter: { color: DESIGN.colors.coral, fontSize: 10, fontWeight: '700', fontFamily: 'monospace' },
  label: { color: DESIGN.colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  h1: { fontSize: 26, fontWeight: '700', color: DESIGN.colors.textDark, marginTop: 4, marginBottom: 18 },
  filterBar: { flexDirection: 'row', marginBottom: 20 },
  filterTab: { marginRight: 20, fontSize: 13, color: DESIGN.colors.textMuted },
  activeTab: { color: DESIGN.colors.textDark, fontWeight: '700', borderBottomWidth: 1.5, borderBottomColor: DESIGN.colors.coral, paddingBottom: 2 },
  pinnedCard: { backgroundColor: DESIGN.colors.navy, borderRadius: 14, padding: 20, marginBottom: 20 },
  cardTag: { color: DESIGN.colors.coral, fontSize: 9, fontWeight: '700' },
  cardHeader: { color: '#FFF', fontSize: 15, fontWeight: '600', marginTop: 8, lineHeight: 22 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  cardMetaText: { color: DESIGN.colors.textMuted, fontSize: 9, fontFamily: 'monospace' },
  updateLink: { color: DESIGN.colors.coral, fontSize: 12, fontWeight: '600' },
  feedRow: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: DESIGN.colors.borderLight },
  rowTag: { color: DESIGN.colors.textMuted, fontSize: 9, fontWeight: '700', fontFamily: 'monospace' },
  rowTitle: { fontSize: 15, fontWeight: '600', color: DESIGN.colors.textDark, marginTop: 4 },
  resetButton: { borderColor: DESIGN.colors.navy, borderWidth: 1, paddingVertical: 14, borderRadius: 28, alignItems: 'center', marginTop: 24, marginBottom: 40 },
  resetButtonText: { color: DESIGN.colors.navy, fontSize: 14, fontWeight: '700' }
});