import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';

// Import Modular Components
import BottomTabBar from './src/components/BottomTabBar';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import UploadVideoScreen from './src/screens/UploadVideoScreen';
import ThreatFeedScreen from './src/screens/ThreatFeedScreen';
import MeProfileScreen from './src/screens/ProfileScreen';
import MeSettingsScreen from './src/screens/SettingsScreen';

// Fallback stubs for remaining intermediate processing workflows
const DeepBrainScreen = ({ onNavigate }: any) => <View />;
const AuthenticScreen = ({ onNavigate }: any) => <View />;
const DeepfakeScreen = ({ onNavigate }: any) => <View />;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('LOGIN');
  const [meSubScreen, setMeSubScreen] = useState<'PROFILE' | 'SETTINGS'>('PROFILE');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // Default starting configuration

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const displayNav = currentScreen !== 'LOGIN' && currentScreen !== 'UPLOAD';
  const lightStatusBar = currentScreen === 'LOGIN' || isDarkMode;

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
        
        {currentScreen === 'DEEP_BRAIN' && <DeepBrainScreen onNavigate={handleNavigation} />}
        {currentScreen === 'AUTHENTIC' && <AuthenticScreen onNavigate={handleNavigation} />}
        {currentScreen === 'DEEPFAKE' && <DeepfakeScreen onNavigate={handleNavigation} />}
        
        {currentScreen === 'FEED' && (
          <ThreatFeedScreen onNavigate={handleNavigation} isDarkMode={isDarkMode} />
        )}
        
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
  masterContainer: { flex: 1 },
  windowScreen: { flex: 1 }
});