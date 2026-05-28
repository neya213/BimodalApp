import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { DESIGN } from '../theme/designSystem';

interface BottomTabBarProps {
  active: string;
  navigation: (screen: string) => void;
}

export default function BottomTabBar({ active, navigation }: BottomTabBarProps) {
  // Configured with structural Unicode glyphs acting as crisp minimalist icons
  const tabs = [
    { id: 'HOME', label: 'Home', icon: '⌂' },
    { id: 'UPLOAD', label: 'Upload', icon: '⏏' },
    { id: 'FEED', label: 'Feed', icon: '☲' },
    { id: 'ME', label: 'Me', icon: '👤' },
  ];

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => {
        const isCurrent = active === tab.id || (tab.id === 'UPLOAD' && ['DEEP_BRAIN', 'AUTHENTIC', 'DEEPFAKE'].includes(active));
        return (
          <TouchableOpacity key={tab.id} style={styles.tabButton} onPress={() => navigation(tab.id)}>
            <View style={styles.iconContainer}>
              <Text style={[styles.tabIcon, isCurrent && styles.tabIconActive]}>
                {tab.icon}
              </Text>
              {isCurrent && <View style={styles.activeIndicatorDot} />}
            </View>
            <Text style={[styles.tabLabel, isCurrent && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: { 
    flexDirection: 'row', 
    height: 75, 
    backgroundColor: '#FFFFFF', 
    borderTopWidth: 1, 
    borderTopColor: DESIGN.colors.borderLight, 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    paddingBottom: 12 
  },
  tabButton: { 
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    height: '100%'
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 26,
    position: 'relative',
    marginBottom: 2
  },
  tabIcon: {
    fontSize: 20,
    color: DESIGN.colors.textMuted,
    lineHeight: 22
  },
  tabIconActive: {
    color: DESIGN.colors.navy,
    transform: [{ scale: 1.1 }]
  },
  activeIndicatorDot: { 
    width: 4, 
    height: 4, 
    borderRadius: 2, 
    backgroundColor: DESIGN.colors.coral,
    position: 'absolute',
    bottom: -6
  },
  tabLabel: { 
    fontSize: 10, 
    color: DESIGN.colors.textMuted,
    fontWeight: '500',
    marginTop: 4
  },
  tabLabelActive: { 
    color: DESIGN.colors.navy, 
    fontWeight: '700' 
  }
});