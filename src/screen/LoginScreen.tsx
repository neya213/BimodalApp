import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { DESIGN } from '../theme/designSystem';

export default function LoginScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.topHeader}>
        <Text style={styles.brandTitle}>BIMODAL</Text>
        <Text style={styles.versionTag}>V2.4 • ARM64</Text>
      </View>

      <View style={styles.heroBlock}>
        <Text style={styles.heroMain}>Two-brain deepfake detection, <Text style={styles.highlightText}>on your phone.</Text></Text>
        <Text style={styles.heroSub}>The Fast Brain runs locally. The Deep Brain only sees a clip if your phone isn't sure.</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>USERNAME</Text>
        <TextInput style={styles.textInput} value="alex.morais" editable={false} />
        
        <Text style={styles.inputLabel}>PASSWORD</Text>
        <TextInput style={styles.textInput} secureTextEntry={true} value="devpassword123" editable={false} />
      </View>

      <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('HOME')}>
        <Text style={styles.actionBtnText}>Sign in</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryLink}>
        <Text style={styles.secondaryLinkText}>Create account</Text>
      </TouchableOpacity>

      <View style={styles.footerRow}>
        <Text style={styles.systemStatus}>• FAST BRAIN READY</Text>
        <Text style={styles.langSelector}>EN · ES · ZH · FR</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: DESIGN.colors.navy, paddingHorizontal: 26, justifyContent: 'center' },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', top: 50, left: 26, right: 26 },
  brandTitle: { color: '#FFF', fontSize: 13, fontWeight: '800', letterSpacing: 4 },
  versionTag: { color: DESIGN.colors.textMuted, fontSize: 10, fontFamily: 'monospace' },
  heroBlock: { marginTop: 60 },
  heroMain: { color: '#FFF', fontSize: 30, fontWeight: '700', lineHeight: 38, letterSpacing: -0.5 },
  highlightText: { color: DESIGN.colors.coral },
  heroSub: { color: '#90A3BF', fontSize: 13, marginTop: 14, lineHeight: 20 },
  formContainer: { marginVertical: 40 },
  inputLabel: { color: DESIGN.colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  textInput: { borderBottomWidth: 1, borderBottomColor: '#2D395E', color: '#FFF', fontSize: 15, paddingVertical: 8, marginBottom: 26, fontFamily: 'monospace' },
  actionBtn: { backgroundColor: '#FFF', paddingVertical: 16, borderRadius: 28, alignItems: 'center' },
  actionBtnText: { color: DESIGN.colors.navy, fontSize: 15, fontWeight: '700' },
  secondaryLink: { alignItems: 'center', marginTop: 18 },
  secondaryLinkText: { color: '#FFF', fontSize: 13, opacity: 0.8 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', bottom: 30, left: 26, right: 26 },
  systemStatus: { color: '#00E676', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  langSelector: { color: DESIGN.colors.textMuted, fontSize: 11 }
});