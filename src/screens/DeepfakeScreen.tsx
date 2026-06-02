import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { DESIGN } from '../theme/designSystem';

interface DeepfakeScreenProps {
  onNavigate: (screenName: string) => void;
}

export default function DeepfakeScreen({ onNavigate }: DeepfakeScreenProps) {
  return (
    <ScrollView style={styles.masterScrollContainer} showsVerticalScrollIndicator={false}>
      <View style={[styles.verdictHeroBanner, { backgroundColor: DESIGN.colors.coral }]}>
        <View style={styles.headerRowTransparent}>
          <TouchableOpacity onPress={() => onNavigate('HOME')}>
            <Text style={styles.navActionTextWhite}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.brandTitleWhite}>BIMODAL</Text>
          <Text style={styles.bannerModeIndicator}>DEEP BRAIN</Text>
        </View>

        <Text style={styles.verdictBadgeLabel}>• VERDICT</Text>
        <Text style={styles.verdictMainTitleText}>DEEPFAKE</Text>
        <Text style={styles.verdictSubSummaryParagraph}>
          Pixel-level artefacts in the perioral region. Audio drifts 47 ms behind lip motion.
        </Text>
      </View>

      <View style={styles.paddedContent}>
        <View style={styles.splitMetricsDataRow}>
          <View style={styles.splitMetricCardBlock}>
            <Text style={styles.metaSectionLabel}>CONFIDENCE</Text>
            <Text style={styles.largeDisplayScore}>0.94</Text>
            <Text style={styles.progressFooterMeta}>CF 1.00</Text>
          </View>
          <View style={styles.splitMetricCardBlock}>
            <Text style={styles.metaSectionLabel}>OF 1.00</Text>
            <Text style={styles.largeDisplayScore}>0.94</Text>
            <Text style={styles.progressFooterMeta}>THRESHOLD 0.80</Text>
          </View>
        </View>

        <View style={{ marginVertical: 8 }}>
          <View style={styles.trackBackground}>
            <View style={[styles.filledTrackProgress, { width: '94%', backgroundColor: DESIGN.colors.coral }]} />
          </View>
          <View style={styles.sliderAxisLabelRow}>
            <Text style={styles.axisMarkerText}>0.00</Text>
            <Text style={styles.axisMarkerText}>THRESHOLD 0.80</Text>
            <Text style={styles.axisMarkerText}>1.00</Text>
          </View>
        </View>

        <Text style={[styles.metaSectionLabel, { marginTop: 24, marginBottom: 8 }]}>SIGNALS</Text>

        <View>
          <View style={styles.metricRowEntry}>
            <Text style={styles.metricEntryLabel}>Visual artefacts</Text>
            <Text style={[styles.metricEntryValue, { color: DESIGN.colors.coral }]}>0.96</Text>
          </View>
          <View style={styles.metricRowEntry}>
            <Text style={styles.metricEntryLabel}>Lip-sync drift</Text>
            <Text style={[styles.metricEntryValue, { color: DESIGN.colors.coral }]}>0.88</Text>
          </View>
          <View style={[styles.metricRowEntry, { borderBottomWidth: 0 }]}>
            <Text style={styles.metricEntryLabel}>Fast brain pre-screen</Text>
            <Text style={styles.metricEntryValue}>0.71</Text>
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          <View style={styles.sliderAxisLabelRow}>
            <Text style={styles.metaSectionLabel}>GRAD-CAM EVIDENCE</Text>
            <Text style={styles.seeAllToggleLink}>Open full →</Text>
          </View>
          <View style={styles.gradCamHeatmapMockContainer}>
            <View style={styles.gradCamBlobCoreOverlay} />
            <Text style={styles.gradCamFooterTextTag}>[LAYER 24 : LIP ROI]</Text>
          </View>
        </View>

        <View style={{ marginTop: 32 }}>
          <TouchableOpacity style={styles.actionPrimaryButton} onPress={() => onNavigate('HOME')}>
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
  metricEntryValue: { fontSize: 14, fontWeight: '700', color: DESIGN.colors.light.text, fontFamily: 'monospace' },
  trackBackground: { height: 4, backgroundColor: '#F4F6F9', borderRadius: 2, width: '100%', overflow: 'hidden' },
  filledTrackProgress: { height: '100%', borderRadius: 2 },
  sliderAxisLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  axisMarkerText: { fontSize: 9, fontWeight: '600', color: DESIGN.colors.textMuted, fontFamily: 'monospace' },
  seeAllToggleLink: { color: DESIGN.colors.textMuted, fontSize: 11, fontWeight: '600' },
  gradCamHeatmapMockContainer: { width: '100%', height: 160, backgroundColor: '#1A2342', borderRadius: 12, marginTop: 12, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  gradCamBlobCoreOverlay: { width: 64, height: 44, borderRadius: 22, backgroundColor: DESIGN.colors.coral, opacity: 0.5, shadowColor: DESIGN.colors.coral, shadowRadius: 30, shadowOpacity: 1, elevation: 20 },
  gradCamFooterTextTag: { position: 'absolute', bottom: 12, left: 12, color: '#FFF', fontSize: 9, fontWeight: '700', opacity: 0.4, fontFamily: 'monospace' },
  actionPrimaryButton: { width: '100%', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  actionPrimaryButtonText: { color: '#FFF', fontSize: 15, fontWeight: '700' }
});