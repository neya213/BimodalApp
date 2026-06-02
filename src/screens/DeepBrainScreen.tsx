import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { DESIGN } from '../theme/designSystem';

interface DeepBrainScreenProps {
  onNavigate: (screenName: string) => void;
}

export default function DeepBrainScreen({ onNavigate }: DeepBrainScreenProps) {
  return (
    <ScrollView style={styles.masterScrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRowWhite}>
        <TouchableOpacity onPress={() => onNavigate('HOME')}>
          <Text style={styles.navActionTextMuted}>‹ Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.brandTitleDark}>BIMODAL</Text>
        <Text style={styles.statusPulseText}>• ANALYSING</Text>
      </View>

      <View style={styles.paddedContent}>
        <Text style={styles.metaSectionLabel}>CASCADE GATE</Text>
        <Text style={styles.processingMainHeadline}>
          Below 0.80 — consulting the <Text style={{ color: DESIGN.colors.coral }}>Deep Brain</Text>.
        </Text>

        <View style={styles.pipelineNodeRow}>
          <View style={[styles.nodeIconCircle, { backgroundColor: DESIGN.colors.navy }]}>
            <Text style={styles.nodeIconNumber}>01</Text>
          </View>
          <View style={styles.nodeMetaBlock}>
            <Text style={styles.nodeTitleText}>Fast Brain</Text>
            <Text style={styles.nodeSubtext}>ON-DEVICE • YOLOv11-NANO INT8</Text>
          </View>
          <View style={styles.nodeValueBlock}>
            <Text style={styles.nodeValueMain}>0.62</Text>
            <Text style={styles.nodeValueSub}>184 MS</Text>
          </View>
        </View>

        <View style={styles.pipelineNodeRow}>
          <View style={[styles.nodeIconCircle, { backgroundColor: DESIGN.colors.coral }]}>
            <Text style={styles.nodeIconNumber}>02</Text>
          </View>
          <View style={styles.nodeMetaBlock}>
            <Text style={styles.nodeTitleText}>Deep Brain</Text>
            <Text style={styles.nodeSubtext}>CLOUD • VISUAL + AUDIO SYNC</Text>
          </View>
          <View style={styles.nodeValueBlock}>
            <Text style={[styles.nodeValueMain, { color: DESIGN.colors.coral }]}>---</Text>
            <Text style={styles.nodeValueSub}>LAG</Text>
          </View>
        </View>

        <View style={styles.progressBarSection}>
          <View style={styles.progressBarHeaderRow}>
            <Text style={styles.progressLabelText}>UPLOAD</Text>
            <Text style={styles.progressValueText}>2.1 / 2.4 MB</Text>
          </View>
          <View style={styles.trackBackground}>
            <View style={[styles.filledTrackProgress, { width: '85%', backgroundColor: DESIGN.colors.navy }]} />
          </View>
          <Text style={styles.progressFooterMeta}>TLS 1.3 • PINNED — 2 OF 3 METRICS</Text>
        </View>

        <Text style={[styles.metaSectionLabel, { marginTop: 32, marginBottom: 8 }]}>RUNNING</Text>
        
        <View style={styles.metricRowEntry}>
          <Text style={styles.metricEntryLabel}>Per-frame visual artefacts</Text>
          <Text style={styles.metricEntryValue}>78%</Text>
        </View>

        <View style={styles.metricRowEntry}>
          <Text style={styles.metricEntryLabel}>Lip / phoneme alignment</Text>
          <Text style={styles.metricEntryValue}>41%</Text>
        </View>

        <View style={[styles.metricRowEntry, { borderBottomWidth: 0 }]}>
          <Text style={styles.metricEntryLabel}>Fusion verdict</Text>
          <Text style={[styles.metricEntryValue, { color: DESIGN.colors.textMuted }]}>QUEUE</Text>
        </View>

        <Text style={styles.disclaimerTextFooter}>
          CLIP NEVER LEAVES THE DEVICE BEYOND THIS POINT UNLESS YOU TAP "CONTINUE".
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  masterScrollContainer: { flex: 1, backgroundColor: '#FFF' },
  paddedContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
  headerRowWhite: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F4F6F9' },
  navActionTextMuted: { color: DESIGN.colors.textMuted, fontSize: 14, fontWeight: '600' },
  brandTitleDark: { color: '#121212', fontSize: 13, fontWeight: '800', letterSpacing: 4 },
  statusPulseText: { color: DESIGN.colors.coral, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  metaSectionLabel: { color: DESIGN.colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  processingMainHeadline: { fontSize: 24, fontWeight: '700', color: DESIGN.colors.light.text, lineHeight: 32, marginTop: 12, marginBottom: 32 },
  pipelineNodeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F4F6F9' },
  nodeIconCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  nodeIconNumber: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  nodeMetaBlock: { flex: 1 },
  nodeTitleText: { fontSize: 16, fontWeight: '700', color: DESIGN.colors.light.text },
  nodeSubtext: { fontSize: 9, color: DESIGN.colors.textMuted, fontWeight: '600', marginTop: 4, letterSpacing: 0.5 },
  nodeValueBlock: { alignItems: 'flex-end' },
  nodeValueMain: { fontSize: 18, fontWeight: '700', color: DESIGN.colors.light.text, fontFamily: 'monospace' },
  nodeValueSub: { fontSize: 9, color: DESIGN.colors.textMuted, fontWeight: '700', marginTop: 2 },
  progressBarSection: { marginTop: 32 },
  progressBarHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabelText: { fontSize: 10, fontWeight: '700', color: DESIGN.colors.light.text, letterSpacing: 0.5 },
  progressValueText: { fontSize: 11, fontWeight: '700', color: DESIGN.colors.light.text, fontFamily: 'monospace' },
  trackBackground: { height: 4, backgroundColor: '#F4F6F9', borderRadius: 2, width: '100%', overflow: 'hidden' },
  filledTrackProgress: { height: '100%', borderRadius: 2 },
  progressFooterMeta: { fontSize: 9, color: DESIGN.colors.textMuted, fontWeight: '600', marginTop: 8, letterSpacing: 0.5 },
  metricRowEntry: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F4F6F9' },
  metricEntryLabel: { fontSize: 14, color: DESIGN.colors.light.text, fontWeight: '500' },
  metricEntryValue: { fontSize: 14, fontWeight: '700', color: DESIGN.colors.light.text, fontFamily: 'monospace' },
  disclaimerTextFooter: { color: DESIGN.colors.textMuted, fontSize: 9, fontWeight: '600', textAlign: 'center', marginTop: 48, lineHeight: 16, letterSpacing: 0.5 }
});