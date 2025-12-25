/**
 * Compact habit card component for home screen
 * Displays habit icon, name, and 4-week progress grid
 */

import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Shadows, BorderRadius, Spacing } from '../constants/spacing';
import { Typography } from '../constants/typography';
import { Habit } from '../models/Habit';
import { Progress } from '../models/Progress';
import { ProgressGrid } from './ProgressGrid';

interface HabitCardProps {
  habit: Habit;
  progressData: Progress[];
  onPress: (habitId: string) => void;
  onTilePress?: (habitId: string, date: string) => void;
  onTileLongPress?: (habitId: string, date: string) => void;
  isDragging?: boolean;
}

export const HabitCard: React.FC<HabitCardProps> = memo(({
  habit,
  progressData,
  onPress,
  onTilePress,
  onTileLongPress,
  isDragging = false,
}) => {
  const handlePress = useCallback(() => {
    onPress(habit.id);
  }, [onPress, habit.id]);

  const handleTilePress = useCallback((date: string) => {
    if (onTilePress) {
      onTilePress(habit.id, date);
    }
  }, [onTilePress, habit.id]);

  const handleTileLongPress = useCallback((date: string) => {
    if (onTileLongPress) {
      onTileLongPress(habit.id, date);
    }
  }, [onTileLongPress, habit.id]);

  return (
    <TouchableOpacity
      style={[styles.container, isDragging && styles.dragging]}
      onPress={handlePress}
      activeOpacity={0.7}
      delayLongPress={200}
    >
      {/* Header with icon and name */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={habit.icon as any}
            size={24}
            color={Colors.textPrimary}
          />
        </View>
        <Text style={styles.habitName} numberOfLines={1}>
          {habit.name}
        </Text>
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={Colors.textTertiary}
        />
      </View>

      {/* Compact 4-week progress grid */}
      <View style={styles.gridContainer}>
        <ProgressGrid
          weeks={4}
          progressData={progressData}
          habitLevels={habit.levels}
          onTilePress={handleTilePress}
          onTileLongPress={handleTileLongPress}
          tileSize={20}
          showDayLabels={false}
          showMonthLabels={false}
          compact
        />
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.card,
    padding: Spacing.xl,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  dragging: {
    opacity: 0.9,
    transform: [{ scale: 1.02 }],
    ...Shadows.cardHover,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.icon,
    backgroundColor: Colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  habitName: {
    flex: 1,
    fontFamily: Typography.fontFamily.serifMedium,
    fontSize: Typography.fontSize.title,
    color: Colors.textPrimary,
  },
  gridContainer: {
    alignItems: 'center',
  },
});

HabitCard.displayName = 'HabitCard';
