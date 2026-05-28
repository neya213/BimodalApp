import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { DESIGN } from '../theme/designSystem';

export default function DeepBrainScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Direct prototype path into choice metrics
      onNavigate('AUTHENTIC');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ScrollView style={styles.view} showsVerticalScrollIndicator={false}>
      <View style={styles.topBar}>
        <Text style={styles.cancelLink}>‹ Cancel</Text>
        <Text style={styles.centerLogo}>BIMODAL</Text>
        <Text style={styles.statusDot}>• ANALYSING</Text>
      </View>

      <Text style={styles.cascadeSub}>CASCADE GATE</Text>
      <Text style={styles.headline}>Below 0.80 — consulting the <Text style={{ color: DESIGN.colors.coral }}>Deep Brain.</Text></Text>

      <View style={styles.nodeItem}>
        <View style={styles.stepCircle}><Text style={styles.stepNum}>01</Text></View>
        <View style={styles.nodeBody}>
          <Text style={styles.nodeTitle}>Fast Brain</Text>
          <Text style={styles.nodeMeta}>ON-DEVICE · YOLOV11-NANO · INT8</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.nodeMetric}>0.62</Text>
          <Text style={styles.nodeMetricSub}>184 MS</Text>
        </View>
      </View>

      <View style={styles.connectionLine} />

      <View style={styles.nodeItem}>
        <View style={[styles.stepCircle, { backgroundColor: DESIGN.colors.coral }]}><Text style={styles.stepNum}>02</Text></View>
        <View style={styles.nodeBody}>
          <Text style={styles.nodeTitle}>Deep Brain</Text>
          <Text style={styles.nodeMeta}>CLOUD · VISUAL + AUDIO SYNC</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.nodeMetric, { color: DESIGN.colors.coral }]}>---</Text>
          <Text style={styles.nodeMetricSub}>+ 4 S</Text>
        </View>
      </View>

      <View style={styles.uploadBlock}>
        <View style={styles.progressTextRow}>
          <Text style={styles.uploadLabel}>UPLOAD</Text>
          <Text style={styles.uploadValue}>2.4 / 2.4 MB</Text>
        </View>
        <View style={styles.barBackground}><View style={styles.barFill} /></View>
        <Text style={styles.secureEncryption}>TLS 1.3 · PINNED · 0 OF 3 RETRIES</Text>
      </View>

      <Text style={styles.sectionLabel}>RUNNING</Text>
      <View style={styles.statRow}><Text style={styles.statName}>Per-frame visual artefacts</Text><Text style={styles.statVal}>78%</Text></View>
      <View style={styles.statRow}><Text style={styles.statName}>Lip / phoneme alignment</Text><Text style={styles.statVal}>41%</Text></View>
      <View style={styles.statRow}><Text style={styles.statName}>Fusion verdict</Text><Text style={[styles.statVal, { color: DESIGN.colors.textMuted }]}>queued</Text></View>

      <Text style={styles.noticeText}>CLIP NEVER LEAVES THE DEVICE BEYOND THIS POINT UNLESS YOU TAP "CONTINUE".</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  view: { flex: 1, backgroundColor: DESIGN.colors.bgWhite, paddingHorizontal: 24, paddingTop: 50 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 },
  cancelLink: { color: DESIGN.colors.textMuted, fontSize: 13 },
  centerLogo: { color: DESIGN.colors.navy, fontSize: 13, fontWeight: '800', letterSpacing: 4 },
  statusDot: { color: DESIGN.colors.coral, fontSize: 9, fontWeight: '700' },
  cascadeSub: { color: DESIGN.colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  headline: { fontSize: 24, fontWeight: '700', color: DESIGN.colors.textDark, marginTop: 6, marginBottom: 30 },
  nodeItem: { flexDirection: 'row', alignItems: 'center' },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: DESIGN.colors.navy, alignItems: 'center', justifyContent: 'center' },
  stepNum: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  nodeBody: { flex: 1, paddingLeft: 14 },
  nodeTitle: { fontSize: 15, fontWeight: '700', color: DESIGN.colors.textDark },
  nodeMeta: { fontSize: 9, color: DESIGN.colors.textMuted, marginTop: 2, fontFamily: 'monospace' },
  nodeMetric: { fontSize: 16, fontWeight: '700', fontFamily: 'monospace', color: DESIGN.colors.textDark },
  nodeMetricSub: { fontSize: 9, color: DESIGN.colors.textMuted, fontFamily: 'monospace' },
  connectionLine: { width: 1, height: 24, backgroundColor: DESIGN.colors.borderLight, marginLeft: 13, marginVertical: 4 },
  uploadBlock: { marginVertical: 26, paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: DESIGN.colors.borderLight },
  progressTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  uploadLabel: { fontSize: 10, fontWeight: '700', color: DESIGN.colors.textMuted },
  uploadValue: { fontSize: 11, fontWeight: '700', color: DESIGN.colors.textDark, fontFamily: 'monospace' },
  barBackground: { height: 2, backgroundColor: DESIGN.colors.grayFill },
  barFill: { height: 2, backgroundColor: DESIGN.colors.navy, width: '100%' },
  secureEncryption: { fontSize: 9, color: DESIGN.colors.textMuted, fontFamily: 'monospace', marginTop: 8 },
  sectionLabel: { color: DESIGN.colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: DESIGN.colors.borderLight },
  statName: { fontSize: 13, color: DESIGN.colors.textDark },
  statVal: { fontSize: 13, fontWeight: '600', fontFamily: 'monospace' },
  noticeText: { fontSize: 10, color: DESIGN.colors.textMuted, textAlign: 'center', marginVertical: 30, lineHeight: 14 }
});