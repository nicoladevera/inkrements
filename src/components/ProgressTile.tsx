/**
 * Individual tile component representing one day in the progress grid
 */

import React, { memo, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors } from '../constants/colors';
import { BorderRadius } from '../constants/spacing';
import { getColorForLevel } from '../utils/colorUtils';
import { HabitLevel } from '../models/Habit';
import { isWithinLoggingRange, isFutureDate, isToday } from '../utils/dateUtils';

interface ProgressTileProps {
  date: string;                    // YYYY-MM-DD format
  level: number;                   // 0 = not tracked, 1-3 for levels
  habitLevels?: HabitLevel[];      // Custom level colors
  onPress?: (date: string) => void;
  onLongPress?: (date: string) => void;
  size?: number;                   // Tile size in pixels
  showTodayIndicator?: boolean;    // Whether to show special indicator for today
}

export const ProgressTile: React.FC<ProgressTileProps> = memo(({
  date,
  level,
  habitLevels,
  onPress,
  onLongPress,
  size = 28,
  showTodayIndicator = true,
}) => {
  const isTodayDate = isToday(date);
  const isFuture = isFutureDate(date);
  const canLog = isWithinLoggingRange(date);
  const backgroundColor = getColorForLevel(level, habitLevels);

  const handlePress = useCallback(() => {
    if (canLog && onPress) {
      onPress(date);
    }
  }, [canLog, onPress, date]);

  const handleLongPress = useCallback(() => {
    if (level > 0 && onLongPress) {
      onLongPress(date);
    }
  }, [level, onLongPress, date]);

  // Future dates are not interactive
  if (isFuture) {
    return (
      <View
        style={[
          styles.tile,
          styles.futureTile,
          { width: size, height: size },
        ]}
      />
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={handleLongPress}
      disabled={!canLog && level === 0}
      activeOpacity={0.7}
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          backgroundColor,
        },
        isTodayDate && showTodayIndicator && styles.todayTile,
        !canLog && level === 0 && styles.disabledTile,
      ]}
    >
      {/* Optional: Show a dot for today */}
      {isTodayDate && showTodayIndicator && level === 0 && (
        <View style={styles.todayDot} />
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  tile: {
    borderRadius: BorderRadius.tile,
    borderWidth: 1,
    borderColor: Colors.border,
    margin: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  futureTile: {
    backgroundColor: Colors.background,
    opacity: 0.3,
  },
  todayTile: {
    borderColor: Colors.accent,
    borderWidth: 2,
  },
  disabledTile: {
    opacity: 0.5,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.accent,
  },
});

ProgressTile.displayName = 'ProgressTile';
