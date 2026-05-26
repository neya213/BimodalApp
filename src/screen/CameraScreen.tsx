import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { DESIGN } from '../theme/designSystem';

export default function CameraScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  // Automatically cycle views forward down the cascading pipeline layout for prototyping
  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate('DEEP_BRAIN');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.canvas}>
      <Text style={styles.topLogo}>BIMODAL</Text>
      
      <View style={styles.viewfinder}>
        <View style={styles.boundingTarget}>
          <View style={styles.roiTag}><Text style={styles.roiText}>LIP ROI</Text></View>
        </View>
      </View>

      <View style={styles.dashboardTray}>
        <Text style={styles.samplingStats}>Frame 4 of 8 - sampling_</Text>
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: '62%' }]} />
          <View style={styles.thresholdMarker} />
        </View>

        <View style={styles.telemetryRow}>
          <View>
            <Text style={styles.liveScore}>0.62</Text>
            <Text style={styles.liveLabels}>FAST BRAIN • UNCERTAIN</Text>
          </View>
          
          <TouchableOpacity style={styles.recordOuter} onPress={() => onNavigate('DEEP_BRAIN')}>
            <View style={styles.recordInner} />
          </TouchableOpacity>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.liveScore}>184 ms</Text>
            <Text style={styles.liveLabels}>LATENCY</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: { flex: 1, backgroundColor: DESIGN.colors.darkCanvas, paddingHorizontal: 24, paddingTop: 50 },
  topLogo: { color: '#FFF', fontSize: 13, fontWeight: '800', letterSpacing: 4, textAlign: 'center' },
  viewfinder: { flex: 1, marginVertical: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', borderRadius: 20 },
  boundingTarget: { width: 140, height: 70, borderWidth: 1.5, borderColor: DESIGN.colors.coral, borderRadius: 4, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 6 },
  roiTag: { backgroundColor: 'rgba(255, 77, 77, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2 },
  roiText: { color: DESIGN.colors.coral, fontSize: 8, fontWeight: '700', fontFamily: 'monospace' },
  dashboardTray: { marginBottom: 20 },
  samplingStats: { color: '#FFF', fontSize: 12, fontFamily: 'monospace', marginBottom: 12, textAlign: 'center' },
  sliderTrack: { height: 2, backgroundColor: '#1E2943', position: 'relative', marginBottom: 20 },
  sliderFill: { height: 2, backgroundColor: DESIGN.colors.coral },
  thresholdMarker: { position: 'absolute', left: '80%', top: -4, width: 2, height: 10, backgroundColor: DESIGN.colors.coral },
  telemetryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  liveScore: { color: '#FFF', fontSize: 24, fontWeight: '700', fontFamily: 'monospace' },
  liveLabels: { color: DESIGN.colors.textMuted, fontSize: 9, fontWeight: '700', marginTop: 2 },
  recordOuter: { width: 64, height: 64, borderRadius: 32, borderWidth: 4, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  recordInner: { width: 46, height: 46, borderRadius: 23, backgroundColor: DESIGN.colors.coral }
});