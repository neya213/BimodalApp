import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { DESIGN } from '../theme/designSystem';
import type { Outcome } from '../detection/detectionService';

interface AuthenticScreenProps {
  onNavigate: (screen: string) => void;
  routeParams?: { outcome?: Outcome };
}

const SOURCE_BADGE: Record<string, string> = {
  onDeviceFast: 'EDGE ONLY',
  cloudDeep: 'CLOUD VERIFIED',
  cloudFallback: 'CLOUD UNAVAILABLE',
};

const SOURCE_DESCRIPTION: Record<string, string> = {
  onDeviceFast:
    'Fast Brain fake confidence stayed below the 0.80 cascade threshold. The clip never left your device.',
  cloudDeep: 'Deep Brain verified this clip in the cloud and returned an authentic verdict.',
  cloudFallback:
    'The cloud was unreachable, so this is the on-device fallback verdict (fake confidence below 0.50).',
};

export default function AuthenticScreen({ onNavigate, routeParams }: AuthenticScreenProps) {
  const outcome = routeParams?.outcome;
  const score = outcome?.confidence ?? 0;
  const source = outcome?.source ?? 'onDeviceFast';

  return (
    <View style={styles.container}>
      <View style={styles.topCard}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => onNavigate('HOME')}>
            <Text style={styles.backButton}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>BIMODAL</Text>
          <Text style={styles.badgeText}>{SOURCE_BADGE[source]}</Text>
        </View>
        <Text style={styles.verdictStatus}>● VERDICT</Text>
        <Text style={styles.mainTitle}>AUTHENTIC</Text>
        <Text style={styles.description}>{SOURCE_DESCRIPTION[source]}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>FAKE CONFIDENCE</Text>
            <Text style={styles.statNumber}>{score.toFixed(2)}</Text>
            <Text style={styles.statSub}>OF 1.00</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>SOURCE</Text>
            <Text style={styles.sourceValue}>{SOURCE_BADGE[source]}</Text>
            <Text style={styles.statSub}>
              {source === 'onDeviceFast' ? 'ON-DEVICE' : 'CLOUD CASCADE'}
            </Text>
          </View>
        </View>
        {outcome?.debug ? (
          <View style={styles.debugBox}>
            <Text selectable style={styles.debugText}>
              parity build: diag-3{'\n'}
              clip_fake_confidence: {score.toFixed(3)}{'\n'}
              faces: {outcome.debug.framesWithFace}/{outcome.debug.framesTotal} · used:{' '}
              {outcome.debug.framesUsed}/{outcome.debug.framesTotal}{'\n'}
              per-frame: {outcome.debug.perFrame.map((p) => p.toFixed(2)).join(', ')}
            </Text>
          </View>
        ) : null}
        <View style={styles.actionBlock}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => onNavigate('UPLOAD')}>
            <Text style={styles.primaryButtonText}>Scan again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Share verdict</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  topCard: {
    backgroundColor: '#1E294B',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30
  },
  backButton: {
    color: '#FFFFFF',
    fontSize: 16
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2
  },
  badgeText: {
    color: '#A5B4FC',
    fontSize: 10,
    fontWeight: '600'
  },
  verdictStatus: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8
  },
  mainTitle: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12
  },
  description: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 20
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    justifyContent: 'space-between',
    paddingBottom: 40
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  statBox: {
    flex: 1
  },
  statLabel: {
    fontSize: 11,
    color: DESIGN.colors.textMuted,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 8
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: DESIGN.colors.navy
  },
  statNumberText: {
    fontSize: 32,
    fontWeight: '700',
    color: DESIGN.colors.coral
  },
  sourceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: DESIGN.colors.coral
  },
  msUnit: {
    fontSize: 14,
    fontWeight: '500',
    color: DESIGN.colors.textMuted
  },
  statSub: {
    fontSize: 10,
    color: DESIGN.colors.textMuted,
    marginTop: 4
  },
  actionBlock: {
    gap: 12
  },
  primaryButton: {
    backgroundColor: '#1E294B',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center'
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center'
  },
  secondaryButtonText: {
    color: DESIGN.colors.textMuted,
    fontSize: 15,
    fontWeight: '500'
  },
  debugBox: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12
  },
  debugText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18
  }
});