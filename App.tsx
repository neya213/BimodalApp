import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import LoginScreen from './src/screen/LoginScreen';
import HomeScreen from './src/screen/HomeScreen';
import CameraScreen from './src/screen/CameraScreen';
import DeepBrainScreen from './src/screen/DeepBrainScreen';
import AuthenticScreen from './src/screen/AuthenticScreen';
import DeepfakeScreen from './src/screen/DeepfakeScreen';
import ThreatFeedScreen from './src/screen/ThreatFeedScreen';
import BottomTabBar from './src/components/BottomTabBar';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('LOGIN');

  const displayNav = currentScreen !== 'LOGIN' && currentScreen !== 'CAMERA';
  const lightStatusBar = ['LOGIN', 'CAMERA'].includes(currentScreen);

  return (
    <SafeAreaView style={styles.masterContainer}>
      <StatusBar barStyle={lightStatusBar ? 'light-content' : 'dark-content'} />
      <View style={styles.windowScreen}>
        {currentScreen === 'LOGIN' && <LoginScreen onNavigate={setCurrentScreen} />}
        {currentScreen === 'HOME' && <HomeScreen onNavigate={setCurrentScreen} />}
        {currentScreen === 'CAMERA' && <CameraScreen onNavigate={setCurrentScreen} />}
        {currentScreen === 'DEEP_BRAIN' && <DeepBrainScreen onNavigate={setCurrentScreen} />}
        {currentScreen === 'AUTHENTIC' && <AuthenticScreen onNavigate={setCurrentScreen} />}
        {currentScreen === 'DEEPFAKE' && <DeepfakeScreen onNavigate={setCurrentScreen} />}
        {currentScreen === 'FEED' && <ThreatFeedScreen onNavigate={setCurrentScreen} />}
      </View>
      {displayNav && <BottomTabBar active={currentScreen} navigation={setCurrentScreen} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: '#000000' },
  windowScreen: { flex: 1 }
});