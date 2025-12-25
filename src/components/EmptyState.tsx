/**
 * Empty state component
 * Displayed when no habits exist
 */

import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

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
          color={Colors.textSecondary} 
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
        <MaterialCommunityIcons 
          name="plus" 
          size={20} 
          color={Colors.white} 
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
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
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
    backgroundColor: Colors.textPrimary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});

EmptyState.displayName = 'EmptyState';

