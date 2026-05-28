import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { DESIGN } from '../theme/designSystem';

export default function HomeScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <ScrollView style={styles.scrollContainerView} showsVerticalScrollIndicator={false}>
      <Text style={styles.brandTitleTextDark}>BIMODAL</Text>
      <Text style={styles.greeting}>GOOD EVENING</Text>
      <Text style={styles.headline}>Verify a clip in <Text style={{ color: DESIGN.colors.coral }}>under 300 ms.</Text></Text>
      <TouchableOpacity style={styles.heroCard} onPress={() => onNavigate('CAMERA')}>
        <Text style={styles.cardBadge}>INSTANT ALERT • ON-DEVICE</Text>
        <Text style={styles.cardTitle}>Scan with camera</Text>
        <Text style={styles.cardDesc}>Lip-region screening, no upload.</Text>
      </TouchableOpacity>
      {['Upload video', 'Threat feed', 'Model & privacy'].map((item, index) => (
        <TouchableOpacity key={index} style={styles.listItem} onPress={() => item === 'Threat feed' ? onNavigate('FEED') : item === 'Model & privacy' ? onNavigate('ME') : null}>
          <Text style={styles.listTitle}>{item}</Text>
          <Text style={styles.chevron}>→</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainerView: { flex: 1, backgroundColor: '#FFF', paddingHorizontal: 24, paddingTop: 50 },
  brandTitleTextDark: { color: DESIGN.colors.navy, fontSize: 13, fontWeight: '800', letterSpacing: 4, marginBottom: 24 },
  greeting: { color: DESIGN.colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  headline: { fontSize: 26, fontWeight: '700', color: DESIGN.colors.textDark, marginTop: 6, marginBottom: 20 },
  heroCard: { backgroundColor: DESIGN.colors.navy, borderRadius: 16, padding: 22, marginBottom: 20 },
  cardBadge: { color: DESIGN.colors.coral, fontSize: 10, fontWeight: '700' },
  cardTitle: { color: '#FFF', fontSize: 22, fontWeight: '700', marginTop: 10 },
  cardDesc: { color: '#90A3BF', fontSize: 13, marginTop: 4 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: DESIGN.colors.borderLight },
  listTitle: { fontSize: 15, fontWeight: '600', color: DESIGN.colors.textDark },
  chevron: { color: DESIGN.colors.textMuted, fontSize: 16 }
});