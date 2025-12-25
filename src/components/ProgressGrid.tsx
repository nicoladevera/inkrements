/**
 * Reusable tile-based progress grid component
 * Displays a 7-column weekly grid layout with most recent week at top
 */

import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ProgressTile } from './ProgressTile';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { HabitLevel } from '../models/Habit';
import { Progress } from '../models/Progress';
import {
  organizeDatesIntoWeeks,
  formatDate,
  DAY_LABELS,
  getShortMonth,
  isFirstDayOfMonth,
  isSunday,
} from '../utils/dateUtils';

interface ProgressGridProps {
  weeks: number;                    // Number of weeks to display (4, 8, 12, 26, 52)
  progressData: Progress[];         // Array of progress entries
  habitLevels?: HabitLevel[];       // Custom level colors for the habit
  onTilePress?: (date: string) => void;
  onTileLongPress?: (date: string) => void;
  tileSize?: number;                // Size of each tile
  showDayLabels?: boolean;          // Show S M T W T F S headers
  showMonthLabels?: boolean;        // Show month indicators
  compact?: boolean;                // Compact mode for home screen cards
}

export const ProgressGrid: React.FC<ProgressGridProps> = memo(({
  weeks,
  progressData,
  habitLevels,
  onTilePress,
  onTileLongPress,
  tileSize = 28,
  showDayLabels = true,
  showMonthLabels = true,
  compact = false,
}) => {
  // Organize dates into weeks (most recent first)
  const weeklyDates = useMemo(() => organizeDatesIntoWeeks(weeks), [weeks]);

  // Create a map of date -> level for quick lookup
  const progressMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const entry of progressData) {
      map.set(entry.date, entry.level);
    }
    return map;
  }, [progressData]);

  // Get level for a specific date
  const getLevelForDate = (date: Date): number => {
    return progressMap.get(formatDate(date)) || 0;
  };

  // Calculate if we need to show month label for a week
  const getMonthLabel = (weekDates: Date[]): string | null => {
    if (!showMonthLabels) return null;

    // Check if any day in this week is the first of a month
    for (const date of weekDates) {
      if (isFirstDayOfMonth(date) && isSunday(date)) {
        return getShortMonth(date);
      }
    }

    // For the first week, show the month of Sunday
    const sunday = weekDates[0];
    if (isFirstDayOfMonth(sunday) || weekDates === weeklyDates[weeklyDates.length - 1]) {
      return getShortMonth(sunday);
    }

    return null;
  };

  const actualTileSize = compact ? 20 : tileSize;
  const labelWidth = showMonthLabels && !compact ? 36 : 0;

  return (
    <View style={styles.container}>
      {/* Day of week headers */}
      {showDayLabels && !compact && (
        <View style={[styles.headerRow, { marginLeft: labelWidth }]}>
          {DAY_LABELS.map((label, index) => (
            <View
              key={index}
              style={[styles.dayLabel, { width: actualTileSize + 3 }]}
            >
              <Text style={styles.dayLabelText}>{label}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Grid rows (weeks) */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {weeklyDates.map((weekDates, weekIndex) => {
          const monthLabel = getMonthLabel(weekDates);

          return (
            <View key={weekIndex} style={styles.weekRow}>
              {/* Month label */}
              {showMonthLabels && !compact && (
                <View style={[styles.monthLabel, { width: labelWidth }]}>
                  {monthLabel && (
                    <Text style={styles.monthLabelText}>{monthLabel}</Text>
                  )}
                </View>
              )}

              {/* Day tiles */}
              <View style={styles.tilesRow}>
                {weekDates.map((date) => (
                  <ProgressTile
                    key={formatDate(date)}
                    date={formatDate(date)}
                    level={getLevelForDate(date)}
                    habitLevels={habitLevels}
                    onPress={onTilePress}
                    onLongPress={onTileLongPress}
                    size={actualTileSize}
                    showTodayIndicator={!compact}
                  />
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayLabel: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 1.5,
  },
  dayLabelText: {
    fontSize: Typography.fontSize.micro,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textSecondary,
  },
  scrollView: {
    flexGrow: 0,
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthLabel: {
    justifyContent: 'center',
    paddingRight: 4,
  },
  monthLabelText: {
    fontSize: Typography.fontSize.micro,
    color: Colors.textSecondary,
  },
  tilesRow: {
    flexDirection: 'row',
  },
});

ProgressGrid.displayName = 'ProgressGrid';
