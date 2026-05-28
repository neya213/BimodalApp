import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { DESIGN } from '../theme/designSystem';

interface HomeProps {
  onNavigate: (screen: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function HomeScreen({ onNavigate, isDarkMode, toggleTheme }: HomeProps) {
  const theme = isDarkMode ? DESIGN.colors.dark : DESIGN.colors.light;

  return (
    <ScrollView style={[styles.scrollContainer, { backgroundColor: theme.bg }]} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <Text style={[styles.brandTitle, { color: isDarkMode ? '#FFF' : DESIGN.colors.navy }]}>BIMODAL</Text>
        
        {/* Floating Theme Toggle button */}
        <TouchableOpacity style={[styles.themeToggle, { backgroundColor: theme.card }]} onPress={toggleTheme}>
          <Text style={styles.toggleIcon}>{isDarkMode ? '☀️ Day' : '🌙 Night'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.greeting}>GOOD EVENING</Text>
      <Text style={[styles.headline, { color: theme.text }]}>
        Verify a clip in <Text style={{ color: DESIGN.colors.coral }}>under 300 ms.</Text>
      </Text>
      
      <TouchableOpacity style={styles.heroCard} onPress={() => onNavigate('UPLOAD')}>
        <Text style={styles.cardBadge}>SECURE UPLOAD • PIPELINE V2</Text>
        <Text style={styles.cardTitle}>Upload MP4 video</Text>
        <Text style={styles.cardDesc}>Select a file from device storage to run lip-region screening.</Text>
      </TouchableOpacity>

      {['Threat feed', 'Model & privacy'].map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={[styles.listItem, { borderBottomColor: theme.border }]} 
          onPress={() => item === 'Threat feed' ? onNavigate('FEED') : item === 'Model & privacy' ? onNavigate('ME') : null}
        >
          <Text style={[styles.listTitle, { color: theme.text }]}>{item}</Text>
          <Text style={styles.chevron}>→</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, paddingHorizontal: 24, paddingTop: 50 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  brandTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 4 },
  themeToggle: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(118,130,153,0.2)' },
  toggleIcon: { fontSize: 11, fontWeight: '600', color: DESIGN.colors.textMuted },
  greeting: { color: DESIGN.colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  headline: { fontSize: 26, fontWeight: '700', marginTop: 6, marginBottom: 20 },
  heroCard: { backgroundColor: DESIGN.colors.navy, borderRadius: 16, padding: 22, marginBottom: 20 },
  cardBadge: { color: DESIGN.colors.coral, fontSize: 10, fontWeight: '700' },
  cardTitle: { color: '#FFF', fontSize: 22, fontWeight: '700', marginTop: 10 },
  cardDesc: { color: '#90A3BF', fontSize: 13, marginTop: 4 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 18, borderBottomWidth: 1 },
  listTitle: { fontSize: 15, fontWeight: '600' },
  chevron: { color: DESIGN.colors.textMuted, fontSize: 16 }
});