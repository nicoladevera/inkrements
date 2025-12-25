/**
 * Modal for selecting progress level when logging
 */

import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { BorderRadius, Shadows, Spacing } from '../constants/spacing';
import { HabitLevel, TrackingType } from '../models/Habit';
import { formatDisplayDate, parseDateString } from '../utils/dateUtils';

interface LevelSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLevel: (level: number) => void;
  onDelete?: () => void;
  levels: HabitLevel[];
  trackingType: TrackingType;
  date: string;
  currentLevel?: number;
  isEditing?: boolean;
}

export const LevelSelectorModal: React.FC<LevelSelectorModalProps> = memo(({
  visible,
  onClose,
  onSelectLevel,
  onDelete,
  levels,
  trackingType,
  date,
  currentLevel = 0,
  isEditing = false,
}) => {
  const displayDate = formatDisplayDate(parseDateString(date));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.content}>
          <Text style={styles.title}>
            {isEditing ? 'Edit Progress' : 'Log Progress'}
          </Text>
          <Text style={styles.date}>{displayDate}</Text>

          <View style={styles.levelsContainer}>
            {trackingType === 'binary' ? (
              // Binary habit - single completion option
              <TouchableOpacity
                style={[
                  styles.levelButton,
                  currentLevel === 1 && styles.levelButtonSelected,
                ]}
                onPress={() => onSelectLevel(1)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.colorIndicator,
                    { backgroundColor: levels[0]?.colorValue || Colors.level2 }
                  ]}
                />
                <Text style={styles.levelText}>Mark as Completed</Text>
                {currentLevel === 1 && (
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color={Colors.accent}
                  />
                )}
              </TouchableOpacity>
            ) : (
              // Level-based habit - multiple options
              levels.map((level, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.levelButton,
                    currentLevel === index + 1 && styles.levelButtonSelected,
                  ]}
                  onPress={() => onSelectLevel(index + 1)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.colorIndicator,
                      { backgroundColor: level.colorValue }
                    ]}
                  />
                  <Text style={styles.levelText}>{level.name}</Text>
                  {currentLevel === index + 1 && (
                    <MaterialCommunityIcons
                      name="check"
                      size={20}
                      color={Colors.accent}
                    />
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Delete option when editing */}
          {isEditing && currentLevel > 0 && onDelete && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={onDelete}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="delete-outline"
                size={20}
                color={Colors.error}
              />
              <Text style={styles.deleteText}>Remove Progress</Text>
            </TouchableOpacity>
          )}

          {/* Cancel button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  content: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.modal,
    padding: Spacing.xxl,
    width: '100%',
    maxWidth: 320,
    ...Shadows.cardHover,
  },
  title: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.fontSize.title,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  date: {
    fontSize: Typography.fontSize.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  levelsContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  levelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.button,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBackgroundAlt,
  },
  levelButtonSelected: {
    borderColor: Colors.accent,
    borderWidth: 2,
    backgroundColor: Colors.accentLight,
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.tile,
    marginRight: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  levelText: {
    flex: 1,
    fontSize: Typography.fontSize.body,
    color: Colors.textPrimary,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  deleteText: {
    fontSize: Typography.fontSize.body,
    color: Colors.error,
  },
  cancelButton: {
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  cancelText: {
    fontSize: Typography.fontSize.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

LevelSelectorModal.displayName = 'LevelSelectorModal';
