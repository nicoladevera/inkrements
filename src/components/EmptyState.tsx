/**
 * Empty state component
 * Displayed when no habits exist
 * Features a decorative tile grid preview to showcase the progress tracking UI
 */

import React, { memo, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { BorderRadius } from '../constants/spacing';

/**
 * Decorative tile grid showing a preview of what progress looks like
 * Pattern creates a "warm center" effect that draws the eye
 */
const TILE_PATTERN = [
  [0, 1, 2, 1, 0], // Top row
  [1, 2, 3, 2, 1], // Middle row (warmest center)
  [0, 1, 1, 0, 0], // Bottom row
];

const LEVEL_COLORS = [
  '#F5F0FA',           // Level 0: Very light lavender (almost white)
  Colors.accentLight,  // Level 1: Light lavender (#E8D5F0)
  Colors.accent,       // Level 2: Soft lavender (#D4C5E8)
  Colors.accentDark,   // Level 3: Deeper lavender (#B8A5D8)
];

// Sequential twinkling: each tile pulses one at a time
// Order defines the sequence of which tiles twinkle
const TWINKLING_SEQUENCE: [number, number][] = [
  [1, 2],  // Center (level 3) - start here
  [0, 2],  // Top center (level 2)
  [1, 3],  // Middle right (level 2)
  [2, 1],  // Bottom left (level 1)
  [1, 1],  // Middle left (level 2)
];

const PULSE_DURATION = 600; // Duration for one tile's complete pulse (up + down)
const TOTAL_CYCLE = TWINKLING_SEQUENCE.length * PULSE_DURATION; // Total loop duration

// Get the index in the sequence for a tile, or -1 if not in sequence
const getSequenceIndex = (rowIndex: number, colIndex: number): number => {
  return TWINKLING_SEQUENCE.findIndex(([r, c]) => r === rowIndex && c === colIndex);
};

interface DecorativeTileProps {
  level: number;
  sequenceIndex?: number;
}

const DecorativeTile: React.FC<DecorativeTileProps> = memo(({ level, sequenceIndex = -1 }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shouldTwinkle = sequenceIndex >= 0;

  useEffect(() => {
    if (shouldTwinkle) {
      // Calculate when this tile should start its pulse in the sequence
      const startDelay = sequenceIndex * PULSE_DURATION;

      const runAnimation = () => {
        // Wait for our turn in the sequence
        const timeout = setTimeout(() => {
          Animated.sequence([
            // Pulse up
            Animated.timing(pulseAnim, {
              toValue: 1.15,
              duration: PULSE_DURATION / 2,
              useNativeDriver: true,
            }),
            // Pulse down
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: PULSE_DURATION / 2,
              useNativeDriver: true,
            }),
          ]).start();
        }, startDelay);

        return timeout;
      };

      // Start the animation and set up the loop
      let timeout = runAnimation();
      const interval = setInterval(() => {
        timeout = runAnimation();
      }, TOTAL_CYCLE);

      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
  }, [shouldTwinkle, sequenceIndex, pulseAnim]);

  return (
    <Animated.View
      style={[
        styles.decorativeTile,
        { backgroundColor: LEVEL_COLORS[level] },
        shouldTwinkle && { transform: [{ scale: pulseAnim }] },
      ]}
    />
  );
});

DecorativeTile.displayName = 'DecorativeTile';

const DecorativeTileGrid: React.FC = memo(() => {
  return (
    <View style={styles.tileGridContainer}>
      {TILE_PATTERN.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.tileRow}>
          {row.map((level, colIndex) => (
            <DecorativeTile
              key={`${rowIndex}-${colIndex}`}
              level={level}
              sequenceIndex={getSequenceIndex(rowIndex, colIndex)}
            />
          ))}
        </View>
      ))}
    </View>
  );
});

DecorativeTileGrid.displayName = 'DecorativeTileGrid';

interface EmptyStateProps {
  onCreateHabit: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = memo(({ onCreateHabit }) => {
  return (
    <View style={styles.container}>
      <DecorativeTileGrid />

      <Text style={styles.title}>One tile at a time</Text>
      <Text style={styles.subtitle}>
        Start tracking today and watch your consistency take shape.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={onCreateHabit}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <MaterialCommunityIcons
          name="plus"
          size={20}
          color={Colors.textOnGradient}
        />
        <Text style={styles.buttonText}>Create Your First Habit</Text>
      </TouchableOpacity>
    </View>
  );
});

const TILE_SIZE = 32;
const TILE_GAP = 6;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  tileGridContainer: {
    marginBottom: 32,
  },
  tileRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  decorativeTile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: BorderRadius.tile,
    margin: TILE_GAP / 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.fontSize.headline,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: Typography.fontSize.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    maxWidth: 280,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: BorderRadius.pill,
    overflow: 'hidden',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textOnGradient,
  },
});

EmptyState.displayName = 'EmptyState';
