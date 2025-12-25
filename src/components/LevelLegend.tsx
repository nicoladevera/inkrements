/**
 * Legend showing level colors and descriptions
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
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
    padding: 12,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colorSwatch: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  legendText: {
    fontSize: 13,
    color: Colors.textPrimary,
  },
});

LevelLegend.displayName = 'LevelLegend';

