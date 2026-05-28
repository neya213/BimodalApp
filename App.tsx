import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';

// Import Custom Modular UI Blocks
import BottomTabBar from './src/components/BottomTabBar';
import LoginScreen from './src/screen/LoginScreen';
import HomeScreen from './src/screen/HomeScreen';
import CameraScreen from './src/screen/CameraScreen';
import DeepBrainScreen from './src/screen/DeepBrainScreen';
import AuthenticScreen from './src/screen/AuthenticScreen';
import DeepfakeScreen from './src/screen/DeepfakeScreen';
import ThreatFeedScreen from './src/screen/ThreatFeedScreen';
import MeProfileScreen from './src/screen/ProfileScreen';
import MeSettingsScreen from './src/screen/SettingsScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('LOGIN');
  const [meSubScreen, setMeSubScreen] = useState<'PROFILE' | 'SETTINGS'>('PROFILE');

  const displayNav = currentScreen !== 'LOGIN' && currentScreen !== 'CAMERA';
  const lightStatusBar = ['LOGIN', 'CAMERA'].includes(currentScreen);

  const handleNavigation = (screenName: string) => {
    if (screenName === 'ME') {
      setMeSubScreen('PROFILE'); 
    }
    setCurrentScreen(screenName);
  };

  return (
    <SafeAreaView style={styles.masterContainer}>
      <StatusBar barStyle={lightStatusBar ? 'light-content' : 'dark-content'} />
      <View style={styles.windowScreen}>
        {currentScreen === 'LOGIN' && <LoginScreen onNavigate={handleNavigation} />}
        {currentScreen === 'HOME' && <HomeScreen onNavigate={handleNavigation} />}
        {currentScreen === 'CAMERA' && <CameraScreen onNavigate={handleNavigation} />}
        {currentScreen === 'DEEP_BRAIN' && <DeepBrainScreen onNavigate={handleNavigation} />}
        {currentScreen === 'AUTHENTIC' && <AuthenticScreen onNavigate={handleNavigation} />}
        {currentScreen === 'DEEPFAKE' && <DeepfakeScreen onNavigate={handleNavigation} />}
        {currentScreen === 'FEED' && <ThreatFeedScreen onNavigate={handleNavigation} />}
        {currentScreen === 'ME' && (
          meSubScreen === 'PROFILE' ? (
            <MeProfileScreen onNavigateSub={setMeSubScreen} />
          ) : (
            <MeSettingsScreen onNavigateSub={setMeSubScreen} />
          )
        )}
      </View>
      {displayNav && <BottomTabBar active={currentScreen} navigation={handleNavigation} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: '#000000' },
  windowScreen: { flex: 1 }
});