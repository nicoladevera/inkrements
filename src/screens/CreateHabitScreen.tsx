/**
 * Form for creating/editing habits
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '../constants/colors';
import { HABIT_ICONS, DEFAULT_ICON } from '../constants/icons';
import { TrackingType, HabitLevel, DEFAULT_LEVELS, BINARY_LEVEL } from '../models/Habit';
import { createHabit, getHabitById, updateHabit } from '../services/habitService';
import { getDefaultLevelColors, GRAYSCALE_OPTIONS } from '../utils/colorUtils';
import { RootStackParamList } from '../../App';

type CreateHabitScreenRouteProp = RouteProp<RootStackParamList, 'CreateHabit'>;
type CreateHabitScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateHabit'>;

export const CreateHabitScreen: React.FC = () => {
  const navigation = useNavigation<CreateHabitScreenNavigationProp>();
  const route = useRoute<CreateHabitScreenRouteProp>();
  const habitId = route.params?.habitId;
  const isEditing = !!habitId;
  
  // Form state
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(DEFAULT_ICON.name);
  const [trackingType, setTrackingType] = useState<TrackingType>('binary');
  const [levels, setLevels] = useState<HabitLevel[]>([...DEFAULT_LEVELS]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Load existing habit data if editing
  useEffect(() => {
    if (isEditing && habitId) {
      loadHabit();
    }
  }, [habitId, isEditing]);
  
  const loadHabit = async () => {
    setIsLoading(true);
    try {
      const habit = await getHabitById(habitId!);
      if (habit) {
        setName(habit.name);
        setSelectedIcon(habit.icon);
        setTrackingType(habit.trackingType);
        if (habit.trackingType === 'level-based') {
          setLevels(habit.levels);
        }
      }
    } catch (error) {
      console.error('Error loading habit:', error);
      Alert.alert('Error', 'Failed to load habit data');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Set header title
  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Habit' : 'Create Habit',
    });
  }, [navigation, isEditing]);
  
  // Handle level name change
  const handleLevelNameChange = (index: number, newName: string) => {
    const newLevels = [...levels];
    newLevels[index] = { ...newLevels[index], name: newName };
    setLevels(newLevels);
  };
  
  // Handle level color change
  const handleLevelColorChange = (index: number, color: string) => {
    const newLevels = [...levels];
    newLevels[index] = { ...newLevels[index], colorValue: color };
    setLevels(newLevels);
  };
  
  // Add a new level
  const handleAddLevel = () => {
    if (levels.length >= 3) return;
    const defaultColors = getDefaultLevelColors(levels.length + 1);
    setLevels([...levels, { name: `Level ${levels.length + 1}`, colorValue: defaultColors[levels.length] }]);
  };
  
  // Remove a level
  const handleRemoveLevel = (index: number) => {
    if (levels.length <= 2) return;
    const newLevels = levels.filter((_, i) => i !== index);
    setLevels(newLevels);
  };
  
  // Validate form
  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter a habit name');
      return false;
    }
    
    if (trackingType === 'level-based') {
      for (const level of levels) {
        if (!level.name.trim()) {
          Alert.alert('Validation Error', 'Please enter names for all levels');
          return false;
        }
      }
    }
    
    return true;
  };
  
  // Handle save
  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    try {
      if (isEditing && habitId) {
        await updateHabit(habitId, {
          name: name.trim(),
          icon: selectedIcon,
          trackingType,
          levels: trackingType === 'binary' ? [BINARY_LEVEL] : levels,
        });
      } else {
        await createHabit({
          name: name.trim(),
          icon: selectedIcon,
          trackingType,
          levels: trackingType === 'binary' ? undefined : levels,
        });
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Error saving habit:', error);
      Alert.alert('Error', 'Failed to save habit. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Habit Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habit Name</Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="e.g., Read for 30 minutes"
            placeholderTextColor={Colors.textTertiary}
            maxLength={50}
          />
        </View>
        
        {/* Icon Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Icon</Text>
          <View style={styles.iconGrid}>
            {HABIT_ICONS.map((icon) => (
              <TouchableOpacity
                key={icon.name}
                style={[
                  styles.iconButton,
                  selectedIcon === icon.name && styles.iconButtonSelected,
                ]}
                onPress={() => setSelectedIcon(icon.name)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={icon.name as any}
                  size={24}
                  color={selectedIcon === icon.name ? Colors.textPrimary : Colors.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Tracking Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tracking Type</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                trackingType === 'binary' && styles.typeButtonSelected,
              ]}
              onPress={() => setTrackingType('binary')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="checkbox-marked-circle-outline"
                size={20}
                color={trackingType === 'binary' ? Colors.textPrimary : Colors.textSecondary}
              />
              <Text style={[
                styles.typeButtonText,
                trackingType === 'binary' && styles.typeButtonTextSelected,
              ]}>
                Binary
              </Text>
              <Text style={styles.typeDescription}>Done / Not done</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeButton,
                trackingType === 'level-based' && styles.typeButtonSelected,
              ]}
              onPress={() => setTrackingType('level-based')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="chart-bar"
                size={20}
                color={trackingType === 'level-based' ? Colors.textPrimary : Colors.textSecondary}
              />
              <Text style={[
                styles.typeButtonText,
                trackingType === 'level-based' && styles.typeButtonTextSelected,
              ]}>
                Level-based
              </Text>
              <Text style={styles.typeDescription}>Multiple intensities</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Level Configuration (for level-based) */}
        {trackingType === 'level-based' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Levels ({levels.length}/3)</Text>
            
            {levels.map((level, index) => (
              <View key={index} style={styles.levelRow}>
                <View
                  style={[styles.levelColorPreview, { backgroundColor: level.colorValue }]}
                />
                <TextInput
                  style={styles.levelInput}
                  value={level.name}
                  onChangeText={(text) => handleLevelNameChange(index, text)}
                  placeholder={`Level ${index + 1} name`}
                  placeholderTextColor={Colors.textTertiary}
                />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.colorOptions}
                >
                  {GRAYSCALE_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.colorOption,
                        { backgroundColor: option.value },
                        level.colorValue === option.value && styles.colorOptionSelected,
                      ]}
                      onPress={() => handleLevelColorChange(index, option.value)}
                    />
                  ))}
                </ScrollView>
                {levels.length > 2 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveLevel(index)}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={20}
                      color={Colors.textSecondary}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            
            {levels.length < 3 && (
              <TouchableOpacity
                style={styles.addLevelButton}
                onPress={handleAddLevel}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={20}
                  color={Colors.textSecondary}
                />
                <Text style={styles.addLevelText}>Add Level</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
      
      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Habit')}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonSelected: {
    borderColor: Colors.textPrimary,
    borderWidth: 2,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    gap: 4,
  },
  typeButtonSelected: {
    borderColor: Colors.textPrimary,
    borderWidth: 2,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  typeButtonTextSelected: {
    color: Colors.textPrimary,
  },
  typeDescription: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  levelColorPreview: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  levelInput: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  colorOptions: {
    maxWidth: 120,
  },
  colorOption: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  colorOptionSelected: {
    borderColor: Colors.textPrimary,
    borderWidth: 2,
  },
  removeButton: {
    padding: 4,
  },
  addLevelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  addLevelText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveButton: {
    backgroundColor: Colors.textPrimary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});

