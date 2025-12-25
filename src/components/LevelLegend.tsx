/**
 * Legend showing level colors and descriptions
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { BorderRadius, Shadows, Spacing } from '../constants/spacing';
import { HabitLevel, TrackingType } from '../models/Habit';

interface LevelLegendProps {
  levels: HabitLevel[];
  trackingType: TrackingType;
}

export const LevelLegend: React.FC<LevelLegendProps> = memo(({
  levels,
  trackingType,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Legend</Text>
      <View style={styles.legendItems}>
        {/* Not tracked */}
        <View style={styles.legendItem}>
          <View style={[styles.colorSwatch, { backgroundColor: Colors.notTracked }]} />
          <Text style={styles.legendText}>Not tracked</Text>
        </View>

        {/* Level items */}
        {levels.map((level, index) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={[
                styles.colorSwatch,
                { backgroundColor: level.colorValue }
              ]}
            />
            <Text style={styles.legendText}>
              {trackingType === 'binary' ? 'Completed' : level.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.card,
    ...Shadows.card,
  },
  title: {
    fontSize: Typography.fontSize.caption,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: Typography.letterSpacing.wide,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  colorSwatch: {
    width: 16,
    height: 16,
    borderRadius: BorderRadius.tile,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  legendText: {
    fontSize: Typography.fontSize.bodySmall,
    color: Colors.textPrimary,
  },
});

LevelLegend.displayName = 'LevelLegend';
