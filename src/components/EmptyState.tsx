/**
 * Empty state component
 * Displayed when no habits exist
 */

import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { BorderRadius } from '../constants/spacing';

interface EmptyStateProps {
  onCreateHabit: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = memo(({ onCreateHabit }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="sprout"
          size={64}
          color={Colors.accent}
        />
      </View>

      <Text style={styles.title}>Ready to build better habits?</Text>
      <Text style={styles.subtitle}>
        Start tracking your daily progress and watch your consistency grow over time.
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconContainer: {
    marginBottom: 24,
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
