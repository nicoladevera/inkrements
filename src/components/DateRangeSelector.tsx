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
                    color={Colors.textPrimary} 
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
    marginVertical: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectorText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  optionSelected: {
    backgroundColor: Colors.cardBackground,
  },
  optionText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  optionTextSelected: {
    fontWeight: '600',
  },
});

DateRangeSelector.displayName = 'DateRangeSelector';

