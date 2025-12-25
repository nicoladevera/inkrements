/**
 * Statistics display component
 * Shows completion rate and other progress statistics
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { ProgressStatistics as Stats } from '../utils/statisticsUtils';

interface ProgressStatisticsProps {
  statistics: Stats;
  showPercentage?: boolean;
}

export const ProgressStatistics: React.FC<ProgressStatisticsProps> = memo(({
  statistics,
  showPercentage = true,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>{statistics.displayText}</Text>
      {showPercentage && (
        <Text style={styles.percentageText}>
          ({statistics.completionRate}%)
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainText: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  percentageText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

ProgressStatistics.displayName = 'ProgressStatistics';

