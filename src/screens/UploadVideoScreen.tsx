import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { DESIGN } from '../theme/designSystem';

interface UploadVideoScreenProps {
  onNavigate: (screen: string, params?: { videoUri?: string; durationMs?: number }) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function UploadVideoScreen({ onNavigate, isDarkMode, toggleTheme }: UploadVideoScreenProps) {
  const currentTheme = DESIGN.theme(isDarkMode);
  const [loading, setLoading] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState<number>(0);

  const handlePickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied', 
        'We need access to your gallery to upload videos for deepfake analysis!'
      );
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedVideo = result.assets[0];
        setVideoUri(selectedVideo.uri);
        setVideoName(selectedVideo.fileName || selectedVideo.uri.split('/').pop() || 'video.mp4');
        // Video assets carry `duration` in milliseconds — frame sampling needs it (§7.3).
        setDurationMs(selectedVideo.duration ?? 0);
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'Something went wrong while selecting the video.');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessVideo = () => {
    if (!videoUri) {
      Alert.alert('No Video Selected', 'Please choose or upload a video container slot first.');
      return;
    }
    // Hand the picked clip to the cascade runner (DeepBrainScreen).
    onNavigate('DEEPBRAIN', { videoUri, durationMs });
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.bg }]}>
      
      {/* HEADER SECTION WITH BACK BUTTON */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('HOME')}>
          <Text style={styles.backButtonText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentTheme.text || '#FFFFFF' }]}>UPLOAD MEDIA</Text>
        <View style={styles.placeholderBlock} />
      </View>

      {/* VIDEO CONTAINER SLOT / DROPZONE */}
      <TouchableOpacity 
        style={[
          styles.videoContainer, 
          { 
            backgroundColor: isDarkMode ? '#111827' : '#F3F4F6',
            borderColor: videoUri ? DESIGN.colors.coral : '#374151',
            borderStyle: videoUri ? 'solid' : 'dashed'
          }
        ]} 
        onPress={handlePickVideo}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="large" color={DESIGN.colors.coral} />
        ) : videoUri ? (
          <View style={styles.videoSelectedContent}>
            <View style={styles.videoIconFrame}>
              <Text style={styles.videoIcon}>🎬</Text>
            </View>
            <Text style={[styles.videoNameText, { color: currentTheme.text || '#FFFFFF' }]} numberOfLines={1}>
              {videoName}
            </Text>
            <Text style={styles.videoSubText}>Tap container slot to replace file</Text>
          </View>
        ) : (
          <View style={styles.videoPlaceholderContent}>
            <Text style={styles.uploadIcon}>📥</Text>
            <Text style={[styles.placeholderMainText, { color: currentTheme.text || '#FFFFFF' }]}>
              Select Video Container
            </Text>
            <Text style={styles.placeholderSubText}>Supports MP4, MOV up to 50MB</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* FOOTER ACTION BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.processButton, { opacity: videoUri ? 1 : 0.5 }]} 
          onPress={handleProcessVideo}
          disabled={!videoUri || loading}
        >
          <Text style={styles.processButtonText}>Analyze via Bimodal Pipeline</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    paddingVertical: 6,
    paddingRight: 16,
  },
  backButtonText: {
    color: DESIGN.colors.coral,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
  },
  placeholderBlock: {
    width: 50, // Matches backButton box balancing perfectly
  },
  videoContainer: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginVertical: 20,
  },
  videoPlaceholderContent: {
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  placeholderMainText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  placeholderSubText: {
    fontSize: 12,
    color: DESIGN.colors.textMuted,
  },
  videoSelectedContent: {
    alignItems: 'center',
    width: '100%',
  },
  videoIconFrame: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 111, 97, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  videoIcon: {
    fontSize: 32,
  },
  videoNameText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  videoSubText: {
    fontSize: 12,
    color: DESIGN.colors.coral,
    fontWeight: '500',
  },
  footer: {
    width: '100%',
    marginTop: 10,
  },
  processButton: {
    backgroundColor: DESIGN.colors.coral,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  processButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});