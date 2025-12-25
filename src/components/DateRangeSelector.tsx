/**
 * Date range selector component
 * Dropdown/segmented control for timeframe selection
 */

import React, { memo, useState } from 'react';
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

export interface DateRangeOption {
  weeks: number;
  label: string;
  shortLabel: string;
}

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { weeks: 4, label: 'Last 4 weeks (1 month)', shortLabel: '4 weeks' },
  { weeks: 8, label: 'Last 8 weeks (2 months)', shortLabel: '8 weeks' },
  { weeks: 12, label: 'Last 12 weeks (3 months)', shortLabel: '12 weeks' },
  { weeks: 26, label: 'Last 26 weeks (6 months)', shortLabel: '26 weeks' },
  { weeks: 52, label: 'Last 52 weeks (1 year)', shortLabel: '52 weeks' },
];

interface DateRangeSelectorProps {
  selectedWeeks: number;
  onSelect: (weeks: number) => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = memo(({
  selectedWeeks,
  onSelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = DATE_RANGE_OPTIONS.find(opt => opt.weeks === selectedWeeks)
    || DATE_RANGE_OPTIONS[2]; // Default to 12 weeks

  const handleSelect = (weeks: number) => {
    onSelect(weeks);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.selectorText}>{selectedOption.label}</Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={20}
          color={Colors.textSecondary}
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Date Range</Text>

            {DATE_RANGE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.weeks}
                style={[
                  styles.option,
                  option.weeks === selectedWeeks && styles.optionSelected,
                ]}
                onPress={() => handleSelect(option.weeks)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.optionText,
                  option.weeks === selectedWeeks && styles.optionTextSelected,
                ]}>
                  {option.label}
                </Text>
                {option.weeks === selectedWeeks && (
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color={Colors.accent}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.button,
    ...Shadows.card,
  },
  selectorText: {
    fontSize: Typography.fontSize.bodySmall,
    color: Colors.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.modal,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 340,
    ...Shadows.cardHover,
  },
  modalTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.fontSize.title,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.button,
  },
  optionSelected: {
    backgroundColor: Colors.accentLight,
  },
  optionText: {
    fontSize: Typography.fontSize.bodySmall,
    color: Colors.textPrimary,
  },
  optionTextSelected: {
    fontWeight: Typography.fontWeight.semibold,
  },
});

DateRangeSelector.displayName = 'DateRangeSelector';
