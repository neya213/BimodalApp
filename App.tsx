import React, { useEffect, useState } from 'react';
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
import { loadFastBrain } from './src/detection/fastBrain';
import type { Outcome } from './src/detection/detectionService';

// Params carried between screens for one analysis run.
export interface RouteParams {
  videoUri?: string;
  durationMs?: number;
  outcome?: Outcome;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('LOGIN');
  const [meSubScreen, setMeSubScreen] = useState<'PROFILE' | 'SETTINGS'>('PROFILE');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [routeParams, setRouteParams] = useState<RouteParams>({});

  // Detection settings (§2/§10 — API base URL must be configurable, never
  // hardcoded). Empty URL => cloud is effectively off until the user sets it.
  const [apiBaseUrl, setApiBaseUrl] = useState<string>('');
  const [cloudEnabled, setCloudEnabled] = useState<boolean>(true);

  // Load the on-device model once at startup, before the first analysis (§7.7).
  useEffect(() => {
    loadFastBrain().catch((e) =>
      console.warn('[App] Fast Brain failed to load (dev build required):', e),
    );
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const displayNav = !['LOGIN', 'UPLOAD', 'DEEPBRAIN', 'AUTHENTIC', 'DEEPFAKE'].includes(currentScreen);
  const lightStatusBar = currentScreen === 'LOGIN' || isDarkMode || currentScreen === 'AUTHENTIC' || currentScreen === 'DEEPFAKE';

  const handleNavigation = (screenName: string, params?: RouteParams) => {
    if (screenName === 'ME') {
      setMeSubScreen('PROFILE');
    }
    setRouteParams(params ?? {});
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
          <DeepBrainScreen
            onNavigate={handleNavigation}
            isDarkMode={isDarkMode}
            videoUri={routeParams.videoUri}
            durationMs={routeParams.durationMs}
            cloudEnabled={cloudEnabled}
            apiBaseUrl={apiBaseUrl}
          />
        )}

        {currentScreen === 'AUTHENTIC' && (
          <AuthenticScreen onNavigate={handleNavigation} routeParams={routeParams} />
        )}

        {currentScreen === 'DEEPFAKE' && (
          <DeepfakeScreen onNavigate={handleNavigation} routeParams={routeParams} />
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
          <SettingsScreen
            onNavigateSub={() => setMeSubScreen('PROFILE')}
            isDarkMode={isDarkMode}
            apiBaseUrl={apiBaseUrl}
            setApiBaseUrl={setApiBaseUrl}
            cloudEnabled={cloudEnabled}
            setCloudEnabled={setCloudEnabled}
          />
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