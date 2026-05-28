import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { DESIGN } from '../theme/designSystem';

interface MeProfileProps {
  onNavigateSub: (target: 'PROFILE' | 'SETTINGS') => void;
}

export default function MeProfileScreen({ onNavigateSub }: MeProfileProps) {
  const recentLogs = [
    { title: 'Press briefing clip', result: 'AUTHENTIC', score: '0.92', date: 'Today, 14:02', color: '#1A2342' },
    { title: 'Forwarded WhatsApp video', result: 'DEEPFAKE', score: '0.94', date: 'Today, 09:18', color: '#FF4D4D' },
    { title: 'Interview reel', result: 'AUTHENTIC', score: '0.88', date: 'Yesterday', color: '#1A2342' },
    { title: 'Conference Q&A', result: 'UNCERTAIN', score: '0.61 → DEEP BRAIN', date: 'Mon, 18:44', color: DESIGN.colors.textMuted },
  ];

  return (
    <ScrollView style={styles.masterScrollContainer} showsVerticalScrollIndicator={false}>
      <View style={[styles.bannerWrapper, { backgroundColor: DESIGN.colors.navy }]}>
        <View style={styles.profileHeaderRow}>
          <Text style={styles.brandTitleTextWhite}>BIMODAL</Text>
          <TouchableOpacity onPress={() => onNavigateSub('SETTINGS')}>
            <Text style={styles.editActionText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userBadgeRow}>
          <View style={styles.avatarCircle}><Text style={styles.avatarInitials}>AM</Text></View>
          <View style={styles.userMeta}>
            <Text style={styles.usernameTitle}>Alex Morais</Text>
            <Text style={styles.userEmail}>ALEX.MORAIS@BIMODAL.ID</Text>
          </View>
        </View>

        <View style={styles.proPillBadge}>
          <Text style={styles.proText}>• PRO • SEAT 04 OF 12</Text>
        </View>
      </View>

      <View style={styles.statsMetricsRow}>
        <View style={styles.metricItemBlock}>
          <Text style={styles.metricSectionLabel}>LIFETIME</Text>
          <Text style={styles.metricNumberDisplay}>1,284</Text>
          <Text style={styles.metricSubLabel}>SCANS</Text>
        </View>
        <View style={styles.metricItemBlock}>
          <Text style={[styles.metricSectionLabel, { color: DESIGN.colors.coral }]}>37</Text>
          <Text style={[styles.metricNumberDisplay, { color: DESIGN.colors.coral }]}>37</Text>
          <Text style={styles.metricSubLabel}>FLAGGED</Text>
        </View>
        <View style={styles.metricItemBlock}>
          <Text style={styles.metricSectionLabel}>211</Text>
          <Text style={styles.metricNumberDisplay}>211</Text>
          <Text style={styles.metricSubLabel}>MS AVG</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 24, marginTop: 10 }}>
        <View style={styles.sectionHeaderLine}>
          <Text style={styles.sectionHeaderTitle}>RECENT ACTIVITY</Text>
          <Text style={styles.seeAllToggleLink}>See all →</Text>
        </View>

        {recentLogs.map((log, index) => (
          <View key={index} style={styles.activityItemRow}>
            <View style={styles.activityLeftData}>
              <View style={[styles.statusIndicatorDot, { backgroundColor: log.color }]} />
              <View>
                <Text style={styles.activityRecordTitle}>{log.title}</Text>
                <Text style={styles.activityRecordMeta}>
                  <Text style={{ color: log.color, fontWeight: '700' }}>{log.result}</Text>  •  {log.score}
                </Text>
              </View>
            </View>
            <Text style={styles.activityTimestamp}>{log.date}</Text>
          </View>
        ))}

        <TouchableOpacity style={[styles.listItem, { marginTop: 15, borderBottomWidth: 0 }]} onPress={() => onNavigateSub('SETTINGS')}>
          <View>
            <Text style={styles.listTitle}>Saved verdicts</Text>
            <Text style={{ color: DESIGN.colors.textMuted, fontSize: 11, marginTop: 2 }}>14 CLIPS • 2 REPORTS QUEUED</Text>
          </View>
          <Text style={styles.chevron}>→</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  masterScrollContainer: { flex: 1, backgroundColor: '#FFF' },
  bannerWrapper: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 30, alignItems: 'flex-start' },
  profileHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 24 },
  brandTitleTextWhite: { color: '#FFF', fontSize: 13, fontWeight: '800', letterSpacing: 4 },
  editActionText: { color: '#FFF', fontSize: 14, fontWeight: '600', opacity: 0.8 },
  userBadgeRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 16 },
  avatarCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  avatarInitials: { color: '#FFF', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
  userMeta: { marginLeft: 16 },
  usernameTitle: { color: '#FFF', fontSize: 22, fontWeight: '700' },
  userEmail: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '700', fontFamily: 'monospace', marginTop: 3, letterSpacing: 0.5 },
  proPillBadge: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, alignSelf: 'flex-start' },
  proText: { color: '#FFF', fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  statsMetricsRow: { flexDirection: 'row', backgroundColor: '#FFF', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#EBEFF5' },
  metricItemBlock: { flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#EBEFF5' },
  metricSectionLabel: { color: DESIGN.colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 },
  metricNumberDisplay: { fontSize: 24, fontWeight: '700', color: DESIGN.colors.textDark, fontFamily: 'monospace' },
  metricSubLabel: { color: DESIGN.colors.textMuted, fontSize: 8, fontWeight: '600', marginTop: 2, letterSpacing: 0.5 },
  sectionHeaderLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 16 },
  sectionHeaderTitle: { color: DESIGN.colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  seeAllToggleLink: { color: DESIGN.colors.coral, fontSize: 11, fontWeight: '600' },
  activityItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F4F6F9' },
  activityLeftData: { flexDirection: 'row', alignItems: 'center' },
  statusIndicatorDot: { width: 6, height: 6, borderRadius: 3, marginRight: 14 },
  activityRecordTitle: { fontSize: 14, fontWeight: '600', color: DESIGN.colors.textDark },
  activityRecordMeta: { fontSize: 11, color: DESIGN.colors.textMuted, marginTop: 3 },
  activityTimestamp: { fontSize: 11, color: DESIGN.colors.textMuted, fontFamily: 'monospace' },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: DESIGN.colors.borderLight },
  listTitle: { fontSize: 15, fontWeight: '600', color: DESIGN.colors.textDark },
  chevron: { color: DESIGN.colors.textMuted, fontSize: 16 }
});