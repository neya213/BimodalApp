import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { DESIGN } from '../theme/designSystem';

interface MeSettingsProps {
  onNavigateSub: (target: 'PROFILE' | 'SETTINGS') => void;
}

export default function MeSettingsScreen({ onNavigateSub }: MeSettingsProps) {
  const [cascadeMode, setCascadeMode] = useState(true);
  const [cellularDeepMode, setCellularDeepMode] = useState(true);
  const [autoFlagMode, setAutoFlagMode] = useState(true);

  return (
    <ScrollView style={styles.masterScrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.settingsFixedHeader}>
        <TouchableOpacity onPress={() => onNavigateSub('PROFILE')}>
          <Text style={styles.cancelTextAction}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.brandTitleTextDark}>BIMODAL</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <View style={{ paddingHorizontal: 24, paddingTop: 10 }}>
        <Text style={styles.settingsSectionHeadingTag}>SETTINGS</Text>
        <Text style={styles.headline}>Account & model.</Text>

        <View style={styles.miniProfileWidget}>
          <View style={styles.avatarCircle}><Text style={styles.avatarInitials}>AM</Text></View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.usernameTitle}>Alex Morais</Text>
            <Text style={styles.userEmail}>PRO • RENEWS 12 AUG</Text>
          </View>
          <Text style={{ color: DESIGN.colors.coral, fontSize: 13, fontWeight: '600' }}>Manage →</Text>
        </View>

        <Text style={styles.settingsInputGroupingTag}>DETECTION</Text>
        <View style={styles.settingsOptionsCardGrid}>
          <View style={styles.switchSettingCardRow}>
            <Text style={styles.settingCardMainTitle}>Cascade threshold</Text>
            <Text style={styles.valueConstantLabel}>0.80</Text>
          </View>
          
          <View style={styles.switchSettingCardRow}>
            <Text style={styles.settingCardMainTitle}>Run Deep Brain over cellular</Text>
            <Switch value={cellularDeepMode} onValueChange={setCellularDeepMode} trackColor={{ true: DESIGN.colors.coral, false: '#D1D5DB' }} thumbColor="#FFF" />
          </View>

          <View style={styles.switchSettingCardRow}>
            <Text style={styles.settingCardMainTitle}>Auto-flag deepfakes to feed</Text>
            <Switch value={autoFlagMode} onValueChange={setAutoFlagMode} trackColor={{ true: DESIGN.colors.coral, false: '#D1D5DB' }} thumbColor="#FFF" />
          </View>

          <View style={[styles.switchSettingCardRow, { borderBottomWidth: 0, paddingTop: 4 }]}>
            <Text style={styles.settingCardMainTitle}>Lip-ROI quality</Text>
            <Text style={styles.metaSecondaryDescLabel}>High{"\n"}(224×224)</Text>
          </View>
        </View>

        <Text style={styles.settingsInputGroupingTag}>PRIVACY</Text>
        <View style={styles.settingsOptionsCardGrid}>
          <View style={styles.switchSettingCardRow}>
            <Text style={styles.settingCardMainTitle}>Send clips to cloud</Text>
            <Text style={styles.valueConstantLabel}>Only when uncertain</Text>
          </View>
          <View style={styles.switchSettingCardRow}>
            <Text style={styles.settingCardMainTitle}>Local clip retention</Text>
            <Text style={styles.valueConstantLabel}>48 hours</Text>
          </View>
          <View style={[styles.switchSettingCardRow, { borderBottomWidth: 0, paddingTop: 4 }]}>
            <Text style={styles.settingCardMainTitle}>Share anonymous metrics</Text>
            <Switch value={cascadeMode} onValueChange={setCascadeMode} trackColor={{ true: DESIGN.colors.coral, false: '#D1D5DB' }} thumbColor="#FFF" />
          </View>
        </View>

        <Text style={styles.settingsInputGroupingTag}>MODEL</Text>
        <View style={styles.settingsOptionsCardGrid}>
          <View style={styles.switchSettingCardRow}>
            <Text style={styles.settingCardMainTitle}>Fast Brain</Text>
            <Text style={styles.valueConstantLabel}>v2.4.1 - current</Text>
          </View>
          <View style={[styles.switchSettingCardRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.settingCardMainTitle}>OTA channel</Text>
            <Text style={styles.valueConstantLabel}>Stable</Text>
          </View>
        </View>
        
        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  masterScrollContainer: { flex: 1, backgroundColor: '#F9FAFC' },
  settingsFixedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 50, paddingBottom: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EBEFF5' },
  cancelTextAction: { color: DESIGN.colors.textDark, fontSize: 14, fontWeight: '600' },
  brandTitleTextDark: { color: DESIGN.colors.navy, fontSize: 12, fontWeight: '800', letterSpacing: 4 },
  settingsSectionHeadingTag: { color: DESIGN.colors.coral, fontSize: 10, fontWeight: '700', letterSpacing: 1, marginTop: 15 },
  headline: { fontSize: 26, fontWeight: '700', color: DESIGN.colors.textDark, marginTop: 6, marginBottom: 25 },
  miniProfileWidget: { flexDirection: 'row', alignItems: 'center', backgroundColor: DESIGN.colors.navy, padding: 16, borderRadius: 14, marginBottom: 25 },
  avatarCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  avatarInitials: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  usernameTitle: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  userEmail: { color: '#90A3BF', fontSize: 10, fontWeight: '700', fontFamily: 'monospace', marginTop: 1 },
  settingsInputGroupingTag: { color: DESIGN.colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 8, marginTop: 5 },
  settingsOptionsCardGrid: { backgroundColor: '#FFF', borderRadius: 14, paddingHorizontal: 16, borderWidth: 1, borderColor: '#EBEFF5', marginBottom: 20 },
  switchSettingCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F4F6F9' },
  settingCardMainTitle: { fontSize: 14, fontWeight: '500', color: DESIGN.colors.textDark, flex: 1, paddingRight: 10 },
  valueConstantLabel: { fontSize: 13, color: DESIGN.colors.textMuted, fontWeight: '500' },
  metaSecondaryDescLabel: { fontSize: 12, color: DESIGN.colors.textMuted, textAlign: 'right', lineHeight: 16, fontFamily: 'monospace' }
});