import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { DESIGN } from '../theme/designSystem';

export default function HomeScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <Text style={styles.headerLogo}>BIMODAL</Text>
        <View style={styles.avatarCircle}><Text style={styles.avatarText}>AM</Text></View>
      </View>

      <Text style={styles.greeting}>GOOD EVENING</Text>
      <Text style={styles.headline}>Verify a clip in <Text style={{ color: DESIGN.colors.coral }}>under 300 ms.</Text></Text>

      <TouchableOpacity style={styles.heroCard} onPress={() => onNavigate('CAMERA')}>
        <Text style={styles.cardBadge}>INSTANT ALERT • ON-DEVICE</Text>
        <Text style={styles.cardTitle}>Scan with camera</Text>
        <Text style={styles.cardDesc}>Lip-region screening, no upload.</Text>
        <Text style={styles.cardFooterModel}>YOLOV11-NANO · INT8</Text>
      </TouchableOpacity>

      <View style={styles.actionList}>
        {[
          { title: 'Upload video', sub: 'MP4 / MOV - UP TO 10 S' },
          { title: 'Threat feed', sub: '14 NEW THIS WEEK' },
          { title: 'Model & privacy', sub: 'V2.4.0 - OTA CHANNEL' }
        ].map((item, index) => (
          <TouchableOpacity key={index} style={styles.listItem}>
            <View>
              <Text style={styles.listTitle}>{item.title}</Text>
              <Text style={styles.listSub}>{item.sub}</Text>
            </View>
            <Text style={styles.chevron}>→</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>THIS WEEK</Text>
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>47</Text>
          <Text style={styles.metricLabel}>SCANS</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: DESIGN.colors.coral }]}>3</Text>
          <Text style={styles.metricLabel}>FLAGGED</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>218</Text>
          <Text style={styles.metricLabel}>MS AVG</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DESIGN.colors.bgWhite, paddingHorizontal: 24, paddingTop: 50 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  headerLogo: { color: DESIGN.colors.navy, fontSize: 13, fontWeight: '800', letterSpacing: 4 },
  avatarCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: DESIGN.colors.grayFill, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 11, fontWeight: '700', color: DESIGN.colors.textMuted },
  greeting: { color: DESIGN.colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  headline: { fontSize: 26, fontWeight: '700', color: DESIGN.colors.textDark, marginTop: 6, marginBottom: 20 },
  heroCard: { backgroundColor: DESIGN.colors.navy, borderRadius: 16, padding: 22 },
  cardBadge: { color: DESIGN.colors.coral, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  cardTitle: { color: '#FFF', fontSize: 22, fontWeight: '700', marginTop: 10 },
  cardDesc: { color: '#90A3BF', fontSize: 13, marginTop: 4 },
  cardFooterModel: { color: '#52668D', fontSize: 9, fontFamily: 'monospace', marginTop: 24 },
  actionList: { marginVertical: 10 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: DESIGN.colors.borderLight },
  listTitle: { fontSize: 15, fontWeight: '600', color: DESIGN.colors.textDark },
  listSub: { fontSize: 10, color: DESIGN.colors.textMuted, marginTop: 3, fontFamily: 'monospace' },
  chevron: { color: DESIGN.colors.textMuted, fontSize: 16 },
  sectionLabel: { color: DESIGN.colors.textMuted, fontSize: 10, fontWeight: '700', marginTop: 24, letterSpacing: 0.5 },
  metricsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, marginBottom: 40 },
  metricItem: { flex: 1 },
  metricValue: { fontSize: 32, fontWeight: '700', color: DESIGN.colors.textDark },
  metricLabel: { fontSize: 9, color: DESIGN.colors.textMuted, fontWeight: '700', marginTop: 2 }
});