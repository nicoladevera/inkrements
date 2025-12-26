/**
 * Detail view for individual habit with extended timeframes
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { BorderRadius, Shadows, Spacing } from '../constants/spacing';
import { Habit } from '../models/Habit';
import { Progress } from '../models/Progress';
import { ProgressGrid } from '../components/ProgressGrid';
import { LevelLegend } from '../components/LevelLegend';
import { DateRangeSelector } from '../components/DateRangeSelector';
import { ProgressStatistics } from '../components/ProgressStatistics';
import { LevelSelectorModal } from '../components/LevelSelectorModal';
import { getHabitById, deleteHabit } from '../services/habitService';
import { getProgressForDateRange, logProgress, deleteProgressForDate, getProgressForDate } from '../services/progressService';
import { calculateCompletionStats, ProgressStatistics as Stats } from '../utils/statisticsUtils';
import { RootStackParamList } from '../../App';

type HabitDetailScreenRouteProp = RouteProp<RootStackParamList, 'HabitDetail'>;
type HabitDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HabitDetail'>;

export const HabitDetailScreen: React.FC = () => {
  const navigation = useNavigation<HabitDetailScreenNavigationProp>();
  const route = useRoute<HabitDetailScreenRouteProp>();
  const { habitId } = route.params;

  const [habit, setHabit] = useState<Habit | null>(null);
  const [progressData, setProgressData] = useState<Progress[]>([]);
  const [selectedWeeks, setSelectedWeeks] = useState(12); // Default 12 weeks
  const [statistics, setStatistics] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Level selector modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // Load habit and progress data
  const loadData = useCallback(async () => {
    try {
      const habitData = await getHabitById(habitId);
      if (!habitData) {
        Alert.alert('Error', 'Habit not found');
        navigation.goBack();
        return;
      }

      setHabit(habitData);

      const progress = await getProgressForDateRange(habitId, selectedWeeks);
      setProgressData(progress);

      // Calculate statistics
      const stats = calculateCompletionStats(progress, selectedWeeks);
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading habit:', error);
      Alert.alert('Error', 'Failed to load habit data');
    } finally {
      setIsLoading(false);
    }
  }, [habitId, selectedWeeks, navigation]);

  // Load data on mount and focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // Handle date range change
  const handleDateRangeChange = useCallback((weeks: number) => {
    setSelectedWeeks(weeks);
  }, []);

  // Reload when weeks change
  useEffect(() => {
    if (!isLoading) {
      loadData();
    }
  }, [selectedWeeks]);

  // Handle tile press
  const handleTilePress = useCallback(async (date: string) => {
    if (!habit) return;

    const existingProgress = await getProgressForDate(habitId, date);

    if (habit.trackingType === 'binary') {
      if (existingProgress && existingProgress.level > 0) {
        // Already logged, open edit modal
        setSelectedDate(date);
        setCurrentLevel(existingProgress.level);
        setIsEditing(true);
        setModalVisible(true);
      } else {
        // Not logged, mark as done
        await logProgress({ habitId, date, level: 1 });
        loadData();
      }
    } else {
      // For level-based, show modal
      setSelectedDate(date);
      setCurrentLevel(existingProgress?.level || 0);
      setIsEditing(existingProgress && existingProgress.level > 0 ? true : false);
      setModalVisible(true);
    }
  }, [habit, habitId, loadData]);

  // Handle tile long press
  const handleTileLongPress = useCallback(async (date: string) => {
    const existingProgress = await getProgressForDate(habitId, date);
    if (!existingProgress || existingProgress.level === 0) return;

    setSelectedDate(date);
    setCurrentLevel(existingProgress.level);
    setIsEditing(true);
    setModalVisible(true);
  }, [habitId]);

  // Handle level selection
  const handleSelectLevel = useCallback(async (level: number) => {
    try {
      await logProgress({ habitId, date: selectedDate, level });
      setModalVisible(false);
      loadData();
    } catch (error) {
      console.error('Error logging progress:', error);
      Alert.alert('Error', 'Failed to log progress');
    }
  }, [habitId, selectedDate, loadData]);

  // Handle delete progress
  const handleDeleteProgress = useCallback(async () => {
    try {
      await deleteProgressForDate(habitId, selectedDate);
      setModalVisible(false);
      loadData();
    } catch (error) {
      console.error('Error deleting progress:', error);
      Alert.alert('Error', 'Failed to delete progress');
    }
  }, [habitId, selectedDate, loadData]);

  // Handle edit habit
  const handleEditHabit = useCallback(() => {
    navigation.navigate('CreateHabit', { habitId });
  }, [navigation, habitId]);

  // Handle delete habit
  const handleDeleteHabit = useCallback(() => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit?.name}"? This will also delete all progress data and cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHabit(habitId);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting habit:', error);
              Alert.alert('Error', 'Failed to delete habit');
            }
          },
        },
      ]
    );
  }, [habit, habitId, navigation]);

  // Set up header options
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={handleEditHabit}
            style={styles.headerButton}
          >
            <MaterialCommunityIcons name="pencil" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDeleteHabit}
            style={styles.headerButton}
          >
            <MaterialCommunityIcons name="delete-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, handleEditHabit, handleDeleteHabit]);

  if (isLoading || !habit) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Habit Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={habit.icon as any}
            size={32}
            color={Colors.textPrimary}
          />
        </View>
        <View style={styles.habitInfo}>
          <Text style={styles.habitName}>{habit.name}</Text>
          {habit.description && (
            <Text style={styles.habitDescription}>{habit.description}</Text>
          )}
        </View>
      </View>

      {/* Statistics Card */}
      {statistics && (
        <View style={styles.sectionCard}>
          <ProgressStatistics statistics={statistics} />
        </View>
      )}

      {/* Level Legend */}
      <View style={styles.legendContainer}>
        <LevelLegend levels={habit.levels} trackingType={habit.trackingType} />
      </View>

      {/* Date Range Selector */}
      <DateRangeSelector
        selectedWeeks={selectedWeeks}
        onSelect={handleDateRangeChange}
      />

      {/* Progress Grid */}
      <View style={styles.gridContainer}>
        <ProgressGrid
          weeks={selectedWeeks}
          progressData={progressData}
          habitLevels={habit.levels}
          onTilePress={handleTilePress}
          onTileLongPress={handleTileLongPress}
          tileSize={selectedWeeks > 26 ? 18 : 28}
          showDayLabels
          showMonthLabels
        />
      </View>

      {/* Level Selector Modal */}
      {selectedDate && (
        <LevelSelectorModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelectLevel={handleSelectLevel}
          onDelete={handleDeleteProgress}
          levels={habit.levels}
          trackingType={habit.trackingType}
          date={selectedDate}
          currentLevel={currentLevel}
          isEditing={isEditing}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: Typography.fontSize.bodyLarge,
    color: Colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.icon,
    backgroundColor: Colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.fontSize.headline,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  habitDescription: {
    fontSize: Typography.fontSize.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  sectionCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  legendContainer: {
    marginBottom: Spacing.md,
  },
  gridContainer: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  headerButton: {
    padding: Spacing.sm,
  },
});
