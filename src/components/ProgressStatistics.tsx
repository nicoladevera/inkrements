/**
 * Statistics display component
 * Shows completion rate and other progress statistics
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing } from '../constants/spacing';
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
    gap: Spacing.sm,
  },
  mainText: {
    fontSize: Typography.fontSize.bodyLarge,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.medium,
  },
  percentageText: {
    fontSize: Typography.fontSize.bodySmall,
    color: Colors.textSecondary,
  },
});

ProgressStatistics.displayName = 'ProgressStatistics';
