import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';

import BottomTabBar from './src/components/BottomTabBar';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import UploadVideoScreen from './src/screens/UploadVideoScreen';
import ThreatFeedScreen from './src/screens/ThreatFeedScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DeepBrainScreen from './src/screens/DeepBrainScreen';
import AuthenticScreen from './src/screens/AuthenticScreen';
import DeepfakeScreen from './src/screens/DeepfakeScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('LOGIN');
  const [meSubScreen, setMeSubScreen] = useState<'PROFILE' | 'SETTINGS'>('PROFILE');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const displayNav = !['LOGIN', 'UPLOAD', 'DEEPBRAIN', 'AUTHENTIC', 'DEEPFAKE'].includes(currentScreen);
  const lightStatusBar = currentScreen === 'LOGIN' || isDarkMode || currentScreen === 'AUTHENTIC' || currentScreen === 'DEEPFAKE';

  const handleNavigation = (screenName: string) => {
    if (screenName === 'ME') {
      setMeSubScreen('PROFILE');
    }
    setCurrentScreen(screenName);
  };

  return (
    <SafeAreaView style={[styles.masterContainer, { backgroundColor: isDarkMode ? '#0A0E1A' : '#FFFFFF' }]}>
      <StatusBar barStyle={lightStatusBar ? 'light-content' : 'dark-content'} />
      <View style={styles.windowScreen}>
        {currentScreen === 'LOGIN' && (
          <LoginScreen onNavigate={handleNavigation} isDarkMode={isDarkMode} />
        )}

        {currentScreen === 'HOME' && (
          <HomeScreen 
            onNavigate={handleNavigation} 
            isDarkMode={isDarkMode} 
            toggleTheme={toggleTheme} 
          />
        )}

        {currentScreen === 'UPLOAD' && (
          <UploadVideoScreen 
            onNavigate={handleNavigation} 
            isDarkMode={isDarkMode} 
            toggleTheme={toggleTheme} 
          />
        )}

        {currentScreen === 'DEEPBRAIN' && (
          <DeepBrainScreen onNavigate={handleNavigation} />
        )}

        {currentScreen === 'AUTHENTIC' && (
          <AuthenticScreen onNavigate={handleNavigation} />
        )}

        {currentScreen === 'DEEPFAKE' && (
          <DeepfakeScreen onNavigate={handleNavigation} />
        )}

        {currentScreen === 'THREATS' && (
          <ThreatFeedScreen 
            onNavigate={handleNavigation} 
            isDarkMode={isDarkMode} 
          />
        )}

        {currentScreen === 'ME' && meSubScreen === 'PROFILE' && (
          <ProfileScreen onNavigateSub={(target) => target === 'SETTINGS' ? setMeSubScreen('SETTINGS') : handleNavigation('ME')} />
        )}

        {currentScreen === 'ME' && meSubScreen === 'SETTINGS' && (
          <SettingsScreen onNavigateSub={() => setMeSubScreen('PROFILE')} isDarkMode={isDarkMode} />
        )}
      </View>

      {displayNav && (
        <BottomTabBar active={currentScreen} navigation={handleNavigation} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1 },
  windowScreen: { flex: 1 }
});