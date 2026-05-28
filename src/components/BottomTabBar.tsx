import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { DESIGN } from '../theme/designSystem';

interface BottomTabBarProps {
  active: string;
  navigation: (screen: string) => void;
}

export default function BottomTabBar({ active, navigation }: BottomTabBarProps) {
  const tabs = [
    { id: 'HOME', label: 'Home' },
    { id: 'CAMERA', label: 'Scan' },
    { id: 'FEED', label: 'Feed' },
    { id: 'ME', label: 'Me' },
  ];

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => {
        const isCurrent = active === tab.id || (tab.id === 'CAMERA' && ['DEEP_BRAIN', 'AUTHENTIC', 'DEEPFAKE'].includes(active));
        return (
          <TouchableOpacity key={tab.id} style={styles.tabButton} onPress={() => navigation(tab.id)}>
            <View style={[styles.dot, { backgroundColor: isCurrent ? DESIGN.colors.coral : 'transparent' }]} />
            <Text style={[styles.tabLabel, isCurrent && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: { flexDirection: 'row', height: 70, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: DESIGN.colors.borderLight, justifyContent: 'space-around', alignItems: 'center', paddingBottom: 10 },
  tabButton: { alignItems: 'center' },
  dot: { width: 4, height: 4, borderRadius: 2, marginBottom: 4 },
  tabLabel: { fontSize: 11, color: DESIGN.colors.textMuted },
  tabLabelActive: { color: DESIGN.colors.textDark, fontWeight: '700' }
});