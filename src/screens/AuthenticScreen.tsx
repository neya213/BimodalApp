import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { DESIGN } from '../theme/designSystem';

interface AuthenticScreenProps {
  onNavigate: (screenName: string) => void;
}

export default function AuthenticScreen({ onNavigate }: AuthenticScreenProps) {
  return (
    <ScrollView style={styles.masterScrollContainer} showsVerticalScrollIndicator={false}>
      <View style={[styles.verdictHeroBanner, { backgroundColor: DESIGN.colors.navy }]}>
        <View style={styles.headerRowTransparent}>
          <TouchableOpacity onPress={() => onNavigate('HOME')}>
            <Text style={styles.navActionTextWhite}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.brandTitleWhite}>BIMODAL</Text>
          <Text style={styles.bannerModeIndicator}>EDGE ONLY</Text>
        </View>

        <Text style={styles.verdictBadgeLabel}>• VERDICT</Text>
        <Text style={styles.verdictMainTitleText}>AUTHENTIC</Text>
        <Text style={styles.verdictSubSummaryParagraph}>
          Confidence cleared the 0.80 cascade threshold. The clip never left your device.
        </Text>
      </View>

      <View style={styles.paddedContent}>
        <View style={styles.splitMetricsDataRow}>
          <View style={styles.splitMetricCardBlock}>
            <Text style={styles.metaSectionLabel}>CONFIDENCE</Text>
            <Text style={styles.largeDisplayScore}>0.92</Text>
            <Text style={styles.progressFooterMeta}>CF 1.00</Text>
          </View>
          <View style={styles.splitMetricCardBlock}>
            <Text style={styles.metaSectionLabel}>ROUND TRIP</Text>
            <Text style={[styles.largeDisplayScore, { color: DESIGN.colors.coral }]}>247 ms</Text>
            <Text style={styles.progressFooterMeta}>INSTANT ALERT</Text>
          </View>
        </View>

        <Text style={[styles.metaSectionLabel, { marginTop: 24, marginBottom: 8 }]}>SAMPLED FRAMES — 8 OF 8</Text>

        <View style={styles.filmstripRowLayout}>
          {[...Array(6)].map((_, i) => (
            <View key={i} style={styles.filmstripFramePlaceholder} />
          ))}
        </View>

        <View style={{ marginTop: 12 }}>
          <View style={styles.metricRowEntry}>
            <Text style={styles.metricEntryLabel}>Face detection</Text>
            <Text style={styles.activityTimestamp}>38 ms</Text>
          </View>
          <View style={styles.metricRowEntry}>
            <Text style={styles.metricEntryLabel}>Lip-ROI crop</Text>
            <Text style={styles.activityTimestamp}>4 ms</Text>
          </View>
          <View style={[styles.metricRowEntry, { borderBottomWidth: 0 }]}>
            <Text style={styles.metricEntryLabel}>Inference</Text>
            <Text style={styles.activityTimestamp}>15 ms</Text>
          </View>
        </View>

        <View style={{ marginTop: 32, gap: 12 }}>
          <TouchableOpacity style={[styles.actionPrimaryButton, { backgroundColor: '#1A2342' }]} onPress={() => onNavigate('HOME')}>
            <Text style={styles.actionPrimaryButtonText}>Scan again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  masterScrollContainer: { flex: 1, backgroundColor: '#FFF' },
  paddedContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
  headerRowTransparent: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 32 },
  navActionTextWhite: { color: '#FFF', fontSize: 14, fontWeight: '600', opacity: 0.8 },
  brandTitleWhite: { color: '#FFF', fontSize: 13, fontWeight: '800', letterSpacing: 4 },
  bannerModeIndicator: { color: '#FFF', fontSize: 10, fontWeight: '700', opacity: 0.6, letterSpacing: 1 },
  metaSectionLabel: { color: DESIGN.colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  verdictHeroBanner: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40, alignItems: 'flex-start' },
  verdictBadgeLabel: { color: '#FFF', fontSize: 10, fontWeight: '700', opacity: 0.7, letterSpacing: 1, marginBottom: 12 },
  verdictMainTitleText: { color: '#FFF', fontSize: 44, fontWeight: '800', letterSpacing: 2, marginBottom: 16 },
  verdictSubSummaryParagraph: { color: '#FFF', fontSize: 14, lineHeight: 22, opacity: 0.85 },
  splitMetricsDataRow: { flexDirection: 'row', gap: 24, marginBottom: 16 },
  splitMetricCardBlock: { flex: 1 },
  largeDisplayScore: { fontSize: 48, fontWeight: '800', color: DESIGN.colors.light.text, fontFamily: 'monospace', marginVertical: 4 },
  progressFooterMeta: { fontSize: 9, color: DESIGN.colors.textMuted, fontWeight: '600', marginTop: 8, letterSpacing: 0.5 },
  metricRowEntry: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F4F6F9' },
  metricEntryLabel: { fontSize: 14, color: DESIGN.colors.light.text, fontWeight: '500' },
  filmstripRowLayout: { flexDirection: 'row', gap: 8, marginVertical: 8, width: '100%' },
  filmstripFramePlaceholder: { flex: 1, aspectRatio: 1, backgroundColor: '#F4F6F9', borderRadius: 4, opacity: 0.6 },
  activityTimestamp: { fontSize: 12, color: DESIGN.colors.textMuted, fontFamily: 'monospace' },
  actionPrimaryButton: { width: '100%', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  actionPrimaryButtonText: { color: '#FFF', fontSize: 15, fontWeight: '700' }
});