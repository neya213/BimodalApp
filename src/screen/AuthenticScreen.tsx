import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { DESIGN } from '../theme/designSystem';

export default function AuthenticScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.topHeroBanner}>
        <View style={styles.headerContext}>
          <Text style={styles.backLink}>‹ Back</Text>
          <Text style={styles.bannerLogo}>BIMODAL</Text>
          <Text style={styles.metaContext}>EDGE ONLY</Text>
        </View>
        <Text style={styles.verdictSubtitle}>• VERDICT</Text>
        <Text style={styles.verdictTitle}>AUTHENTIC</Text>
        <Text style={styles.verdictDesc}>Confidence cleared the 0.80 cascade threshold. The clip never left your device.</Text>
      </View>

      <View style={styles.bodyMetrics}>
        <View style={styles.splitRow}>
          <View style={styles.splitBlock}>
            <Text style={styles.metricLabel}>CONFIDENCE</Text>
            <Text style={styles.metricValue}>0.92</Text>
            <Text style={styles.metricSub}>OF 1.00</Text>
          </View>
          <View style={styles.splitBlock}>
            <Text style={styles.metricLabel}>ROUND TRIP</Text>
            <Text style={[styles.metricValue, { color: DESIGN.colors.coral }]}>247<Text style={{ fontSize: 14 }}>ms</Text></Text>
            <Text style={styles.metricSub}>INSTANT ALERT</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>SAMPLED FRAMES — 8 OF 8</Text>
        <View style={styles.frameGrid}>
          {[1,2,3,4,5,6,7,8].map((i) => <View key={i} style={styles.thumbnailBox} />)}
        </View>

        <View style={styles.dataRow}><Text style={styles.dataLabel}>Face detection</Text><Text style={styles.dataValue}>38 ms</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Lip-ROI crop</Text><Text style={styles.dataValue}>4 ms</Text></View>
        <View style={styles.dataRow}><Text style={styles.dataLabel}>Inference</Text><Text style={styles.dataValue}>76 ms</Text></View>

        <TouchableOpacity style={styles.primaryBtn} onPress={() => onNavigate('DEEPFAKE')}>
          <Text style={styles.primaryBtnText}>Scan again</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => onNavigate('FEED')}>
          <Text style={styles.secondaryBtnText}>Share verdict</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: DESIGN.colors.bgWhite },
  topHeroBanner: { backgroundColor: DESIGN.colors.navy, paddingHorizontal: 24, paddingTop: 50, paddingBottom: 30 },
  headerContext: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  backLink: { color: '#FFF', fontSize: 13, opacity: 0.7 },
  bannerLogo: { color: '#FFF', fontSize: 13, fontWeight: '800', letterSpacing: 4 },
  metaContext: { color: '#FFF', fontSize: 9, fontFamily: 'monospace', opacity: 0.6 },
  verdictSubtitle: { color: DESIGN.colors.coral, fontSize: 10, fontWeight: '700', letterSpacing: 1, textAlign: 'center' },
  verdictTitle: { color: '#FFF', fontSize: 34, fontWeight: '800', letterSpacing: 2, textAlign: 'center', marginVertical: 8 },
  verdictDesc: { color: '#90A3BF', fontSize: 12, textAlign: 'center', lineHeight: 18, paddingHorizontal: 10 },
  bodyMetrics: { padding: 24 },
  splitRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 26 },
  splitBlock: { flex: 1 },
  metricLabel: { color: DESIGN.colors.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  metricValue: { fontSize: 38, fontWeight: '700', color: DESIGN.colors.textDark, fontFamily: 'monospace', marginTop: 4 },
  metricSub: { color: DESIGN.colors.textMuted, fontSize: 9, fontWeight: '600', marginTop: 2 },
  sectionTitle: { color: DESIGN.colors.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 0.5, marginBottom: 10 },
  frameGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  thumbnailBox: { width: '11%', aspectRatio: 1, backgroundColor: DESIGN.colors.grayFill, borderRadius: 4 },
  dataRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: DESIGN.colors.borderLight },
  dataLabel: { fontSize: 14, color: DESIGN.colors.textDark },
  dataValue: { fontSize: 13, color: DESIGN.colors.textMuted, fontFamily: 'monospace' },
  primaryBtn: { backgroundColor: DESIGN.colors.navy, paddingVertical: 16, borderRadius: 28, alignItems: 'center', marginTop: 30 },
  primaryBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  secondaryBtn: { paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  secondaryBtnText: { color: DESIGN.colors.textDark, fontSize: 14, fontWeight: '600' }
});