import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { DESIGN } from '../theme/designSystem';

interface LoginProps {
  onNavigate: (screen: string) => void;
  isDarkMode: boolean;
}

export default function LoginScreen({ onNavigate, isDarkMode }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={[styles.wrapper, { backgroundColor: DESIGN.colors.navy }]}
    >
      <View style={styles.topHeader}>
        <Text style={styles.brandTitleTextWhite}>BIMODAL</Text>
        <Text style={styles.versionTag}>V2.4 • ARM64</Text>
      </View>
      
      <View style={styles.heroBlock}>
        <Text style={styles.heroMain}>Two-brain deepfake detection, <Text style={{ color: DESIGN.colors.coral }}>on your phone.</Text></Text>
        <Text style={styles.heroSub}>The Fast Brain runs locally. The Deep Brain only sees a clip if your phone isn't sure.</Text>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>USERNAME</Text>
        <TextInput 
          style={styles.textInput} 
          placeholder="Enter username..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        <Text style={styles.inputLabel}>PASSWORD</Text>
        <TextInput 
          style={styles.textInput} 
          placeholder="Enter password..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          secureTextEntry={true} 
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      
      <TouchableOpacity style={styles.actionBtnWhite} onPress={() => onNavigate('HOME')}>
        <Text style={{ color: DESIGN.colors.navy, fontSize: 15, fontWeight: '700' }}>Sign in</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, paddingHorizontal: 26, justifyContent: 'center' },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', top: 50, left: 26, right: 26 },
  brandTitleTextWhite: { color: '#FFF', fontSize: 13, fontWeight: '800', letterSpacing: 4, textAlign: 'center' },
  versionTag: { color: DESIGN.colors.textMuted, fontSize: 10, fontFamily: 'monospace' },
  heroBlock: { marginTop: 40 },
  heroMain: { color: '#FFF', fontSize: 30, fontWeight: '700', lineHeight: 38 },
  heroSub: { color: '#90A3BF', fontSize: 13, marginTop: 14, lineHeight: 20 },
  formContainer: { marginVertical: 30 },
  inputLabel: { color: DESIGN.colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  textInput: { borderBottomWidth: 1, borderBottomColor: '#2D395E', color: '#FFF', fontSize: 15, paddingVertical: 8, marginBottom: 20 },
  actionBtnWhite: { backgroundColor: '#FFF', paddingVertical: 16, borderRadius: 28, alignItems: 'center', marginTop: 10 }
});