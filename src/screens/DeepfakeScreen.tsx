import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { DESIGN } from '../theme/designSystem';

export default function DeepfakeScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <ScrollView style={styles.view} showsVerticalScrollIndicator={false}>
      <View style={styles.errorBanner}>
        <View style={styles.bannerNav}>
          <Text style={styles.whiteBack}>‹ Back</Text>
          <Text style={styles.whiteLogo}>BIMODAL</Text>
          <Text style={styles.whiteContext}>DEEP BRAIN</Text>
        </View>
        <Text style={styles.alertMeta}>• VERDICT • FUSED</Text>
        <Text style={styles.alertHeadline}>DEEPFAKE</Text>
        <Text style={styles.alertBody}>Pixel-level artefacts in the perioral region. Audio drifts 47 ms behind lip motion.</Text>
      </View>

      <View style={{ padding: 24 }}>
        <View style={styles.flexHeader}>
          <Text style={styles.label}>CONFIDENCE</Text>
          <Text style={styles.monoLabel}>DF 1.00</Text>
        </View>
        <Text style={styles.massiveScore}>0.94</Text>
        
        <View style={styles.timelineBar}>
          <View style={[styles.timelineFill, { width: '94%' }]} />
          <View style={styles.thresholdTick} />
        </View>
        <View style={styles.rangeLabels}>
          <Text style={styles.rangeText}>0.00</Text>
          <Text style={[styles.rangeText, { fontWeight: '700' }]}>THRESHOLD 0.80</Text>
          <Text style={styles.rangeText}>1.00</Text>
        </View>

        <Text style={styles.sectionHeader}>SIGNALS</Text>
        <View style={styles.row}><Text style={styles.rowLabel}>Visual artefacts</Text><Text style={[styles.rowVal, { color: DESIGN.colors.coral }]}>0.96</Text></View>
        <View style={styles.row}><Text style={styles.rowLabel}>Lip-sync drift</Text><Text style={[styles.rowVal, { color: DESIGN.colors.coral }]}>0.88</Text></View>
        <View style={styles.row}><Text style={styles.rowLabel}>Fast brain pre-screen</Text><Text style={styles.rowVal}>0.71</Text></View>

        <View style={[styles.flexHeader, { marginTop: 24, marginBottom: 12 }]}>
          <Text style={styles.sectionHeader}>GRAD-CAM • EVIDENCE</Text>
          <Text style={styles.interactiveLink}>Open full →</Text>
        </View>

        <View style={styles.previewImageMock}>
          <View style={styles.imageOverlayBadge}><Text style={styles.overlayText}>LAYER 24 • LIP ROI</Text></View>
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={() => onNavigate('FEED')}>
          <Text style={styles.nextBtnText}>Open Threat Feed</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  view: { flex: 1, backgroundColor: DESIGN.colors.bgWhite },
  errorBanner: { backgroundColor: DESIGN.colors.coral, paddingHorizontal: 24, paddingTop: 50, paddingBottom: 30 },
  bannerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  whiteBack: { color: '#FFF', fontSize: 13 },
  whiteLogo: { color: '#FFF', fontSize: 13, fontWeight: '800', letterSpacing: 4 },
  whiteContext: { color: '#FFF', fontSize: 9, fontFamily: 'monospace', opacity: 0.8 },
  alertMeta: { color: '#FFF', fontSize: 10, fontWeight: '700', letterSpacing: 1, textAlign: 'center', opacity: 0.9 },
  alertHeadline: { color: '#FFF', fontSize: 34, fontWeight: '800', letterSpacing: 2, textAlign: 'center', marginVertical: 8 },
  alertBody: { color: '#FFF', fontSize: 12, textAlign: 'center', lineHeight: 18, opacity: 0.95 },
  flexHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: DESIGN.colors.textMuted, fontSize: 9, fontWeight: '700' },
  monoLabel: { color: DESIGN.colors.textMuted, fontSize: 9, fontFamily: 'monospace' },
  massiveScore: { fontSize: 54, fontWeight: '800', color: DESIGN.colors.textDark, fontFamily: 'monospace', marginVertical: 4 },
  timelineBar: { height: 2, backgroundColor: DESIGN.colors.borderLight, position: 'relative', marginTop: 10, marginBottom: 6 },
  timelineFill: { height: 2, backgroundColor: DESIGN.colors.coral },
  thresholdTick: { position: 'absolute', left: '80%', top: -3, width: 2, height: 8, backgroundColor: DESIGN.colors.coral },
  rangeLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  rangeText: { fontSize: 9, color: DESIGN.colors.textMuted, fontFamily: 'monospace' },
  sectionHeader: { color: DESIGN.colors.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 0.5, marginVertical: 8 },
  interactiveLink: { color: DESIGN.colors.textMuted, fontSize: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: DESIGN.colors.borderLight },
  rowLabel: { fontSize: 14, color: DESIGN.colors.textDark },
  rowVal: { fontSize: 14, fontWeight: '700', fontFamily: 'monospace' },
  previewImageMock: { height: 140, backgroundColor: DESIGN.colors.darkCanvas, borderRadius: 12, position: 'relative', justifyContent: 'center', alignItems: 'center' },
  imageOverlayBadge: { position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 2 },
  overlayText: { color: '#FFF', fontSize: 8, fontFamily: 'monospace', fontWeight: '700' },
  nextBtn: { backgroundColor: DESIGN.colors.navy, paddingVertical: 16, borderRadius: 28, alignItems: 'center', marginTop: 30, marginBottom: 20 },
  nextBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' }
});