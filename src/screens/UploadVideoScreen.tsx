import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { DESIGN } from '../theme/designSystem';

interface UploadProps {
  onNavigate: (screen: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function UploadVideoScreen({ onNavigate, isDarkMode, toggleTheme }: UploadProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size?: string } | null>(null);

  const theme = isDarkMode ? DESIGN.colors.dark : DESIGN.colors.light;

  const pickVideoFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Bimodal needs access to your gallery.');
      return;
    }

    try {
      setIsSelecting(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const videoAsset = result.assets[0];
        const extractedName = videoAsset.uri.split('/').pop() || 'evidence_clip.mp4';
        const assetSizeMB = videoAsset.fileSize 
          ? `${(videoAsset.fileSize / (1024 * 1024)).toFixed(1)} MB` 
          : 'Variable Size';

        setSelectedFile({ name: extractedName, size: assetSizeMB });
      }
    } catch (error) {
      Alert.alert('Selection Error', 'Failed to retrieve media file.');
    } finally {
      setIsSelecting(false);
    }
  };

  return (
    <View style={[styles.canvas, { backgroundColor: theme.bg }]}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => onNavigate('HOME')}>
          <Text style={[styles.backTextButton, { color: theme.text }]}>‹ Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.brandTitleText, { color: theme.text }]}>BIMODAL</Text>
        
        {/* Syncing the floating theme switcher here too */}
        <TouchableOpacity style={[styles.themeToggle, { backgroundColor: theme.card }]} onPress={toggleTheme}>
          <Text style={styles.toggleIcon}>{isDarkMode ? '☀️ Day' : '🌙 Night'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.uploadBoxContainer}>
        {!selectedFile ? (
          <TouchableOpacity style={[styles.dropZoneStyle, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={pickVideoFromGallery} disabled={isSelecting}>
            {isSelecting ? (
              <ActivityIndicator size="large" color={DESIGN.colors.coral} />
            ) : (
              <>
                <Text style={styles.uploadIconSymbol}>↑</Text>
                <Text style={[styles.mainUploadText, { color: theme.text }]}>Open Device Gallery</Text>
                <Text style={styles.subUploadText}>Select an MP4 to run lip-region screening</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <View style={[styles.fileSelectedCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={styles.fileIconTag}>🎬</Text>
            <Text style={[styles.fileNameText, { color: theme.text }]} numberOfLines={1} ellipsizeMode="middle">
              {selectedFile.name}
            </Text>
            <Text style={styles.fileMetaDetails}>MPEG-4 Video • {selectedFile.size}</Text>
            
            <TouchableOpacity style={styles.clearFileLink} onPress={() => setSelectedFile(null)}>
              <Text style={{ color: DESIGN.colors.coral, fontSize: 12 }}>Remove file</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={{ paddingBottom: 40 }}>
        <TouchableOpacity 
          style={[styles.primaryActionBtn, { opacity: selectedFile ? 1 : 0.4 }]} 
          disabled={!selectedFile}
          onPress={() => onNavigate('DEEP_BRAIN')}
        >
          <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 15 }}>Initialize Analysis</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: { flex: 1, paddingHorizontal: 24, paddingTop: 50, justifyContent: 'space-between' },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backTextButton: { fontSize: 14, opacity: 0.8 },
  brandTitleText: { fontSize: 12, fontWeight: '800', letterSpacing: 4 },
  themeToggle: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(118,130,153,0.2)' },
  toggleIcon: { fontSize: 11, fontWeight: '600', color: DESIGN.colors.textMuted },
  uploadBoxContainer: { flex: 1, justifyContent: 'center', marginVertical: 40 },
  dropZoneStyle: { borderStyle: 'dashed', borderWidth: 2, borderRadius: 20, height: 260, justifyContent: 'center', alignItems: 'center' },
  uploadIconSymbol: { color: DESIGN.colors.coral, fontSize: 32, marginBottom: 12, fontWeight: '300' },
  mainUploadText: { fontSize: 16, fontWeight: '600' },
  subUploadText: { color: '#768299', fontSize: 12, marginTop: 6, textAlign: 'center', paddingHorizontal: 20 },
  fileSelectedCard: { borderRadius: 20, padding: 30, alignItems: 'center', borderWidth: 1, width: '100%' },
  fileIconTag: { fontSize: 40, marginBottom: 14 },
  fileNameText: { fontSize: 16, fontWeight: '700', textAlign: 'center', paddingHorizontal: 10 },
  fileMetaDetails: { color: '#768299', fontSize: 12, marginTop: 4 },
  clearFileLink: { marginTop: 24, padding: 8 },
  primaryActionBtn: { backgroundColor: DESIGN.colors.coral, paddingVertical: 16, borderRadius: 28, alignItems: 'center' }
});