/**
 * Home screen displaying all habits with 4-week grids
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Shadows, Spacing, BorderRadius } from '../constants/spacing';
import { Habit } from '../models/Habit';
import { Progress } from '../models/Progress';
import { HabitCard } from '../components/HabitCard';
import { EmptyState } from '../components/EmptyState';
import { LevelSelectorModal } from '../components/LevelSelectorModal';
import { getHabits } from '../services/habitService';
import { getProgressForHabits, logProgress, deleteProgressForDate, getProgressForDate } from '../services/progressService';
import { getTimeBasedGreeting, getFormattedDate } from '../utils/greetingUtils';
import { RootStackParamList } from '../../App';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HabitWithProgress {
  habit: Habit;
  progress: Progress[];
}

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [habitsWithProgress, setHabitsWithProgress] = useState<HabitWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Level selector modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // Get greeting and date (refreshes on each render/focus)
  const greeting = useMemo(() => getTimeBasedGreeting(), []);
  const formattedDate = useMemo(() => getFormattedDate(), []);

  // Load habits and progress
  const loadData = useCallback(async () => {
    try {
      const habits = await getHabits();

      if (habits.length === 0) {
        setHabitsWithProgress([]);
        return;
      }

      const habitIds = habits.map(h => h.id);
      const progressMap = await getProgressForHabits(habitIds, 4);

      const data: HabitWithProgress[] = habits.map(habit => ({
        habit,
        progress: progressMap.get(habit.id) || [],
      }));

      setHabitsWithProgress(data);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load habits. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Load data on mount and when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // Handle pull to refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData();
  }, [loadData]);

  // Navigate to habit detail
  const handleHabitPress = useCallback((habitId: string) => {
    navigation.navigate('HabitDetail', { habitId });
  }, [navigation]);

  // Navigate to create habit
  const handleCreateHabit = useCallback(() => {
    navigation.navigate('CreateHabit', {});
  }, [navigation]);

  // Navigate to settings
  const handleSettings = useCallback(() => {
    navigation.navigate('Settings');
  }, [navigation]);

  // Handle tile press (log progress)
  const handleTilePress = useCallback(async (habitId: string, date: string) => {
    const habitData = habitsWithProgress.find(h => h.habit.id === habitId);
    if (!habitData) return;

    const { habit } = habitData;

    // Check if there's existing progress
    const existingProgress = await getProgressForDate(habitId, date);

    if (habit.trackingType === 'binary') {
      // For binary habits, toggle on tap
      if (existingProgress && existingProgress.level > 0) {
        // Already logged, open edit modal
        setSelectedHabit(habit);
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
      setSelectedHabit(habit);
      setSelectedDate(date);
      setCurrentLevel(existingProgress?.level || 0);
      setIsEditing(existingProgress && existingProgress.level > 0 ? true : false);
      setModalVisible(true);
    }
  }, [habitsWithProgress, loadData]);

  // Handle tile long press (edit)
  const handleTileLongPress = useCallback(async (habitId: string, date: string) => {
    const habitData = habitsWithProgress.find(h => h.habit.id === habitId);
    if (!habitData) return;

    const existingProgress = await getProgressForDate(habitId, date);
    if (!existingProgress || existingProgress.level === 0) return;

    setSelectedHabit(habitData.habit);
    setSelectedDate(date);
    setCurrentLevel(existingProgress.level);
    setIsEditing(true);
    setModalVisible(true);
  }, [habitsWithProgress]);

  // Handle level selection from modal
  const handleSelectLevel = useCallback(async (level: number) => {
    if (!selectedHabit) return;

    try {
      await logProgress({
        habitId: selectedHabit.id,
        date: selectedDate,
        level,
      });
      setModalVisible(false);
      loadData();
    } catch (error) {
      console.error('Error logging progress:', error);
      Alert.alert('Error', 'Failed to log progress. Please try again.');
    }
  }, [selectedHabit, selectedDate, loadData]);

  // Handle delete progress
  const handleDeleteProgress = useCallback(async () => {
    if (!selectedHabit) return;

    try {
      await deleteProgressForDate(selectedHabit.id, selectedDate);
      setModalVisible(false);
      loadData();
    } catch (error) {
      console.error('Error deleting progress:', error);
      Alert.alert('Error', 'Failed to delete progress. Please try again.');
    }
  }, [selectedHabit, selectedDate, loadData]);

  // Render greeting header
  const renderHeader = useCallback(() => (
    <View style={styles.greetingContainer}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greetingText}>{greeting}</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettings}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons name="cog-outline" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  ), [greeting, formattedDate, handleSettings]);

  // Render footer with branding
  const renderFooter = useCallback(() => (
    <View style={styles.footerContainer}>
      <Text style={styles.brandName}>Inkrements</Text>
      <Text style={styles.tagline}>Ink your progress, one increment at a time.</Text>
    </View>
  ), []);

  // Render habit card for list
  const renderHabitCard = useCallback(({ item }: { item: HabitWithProgress }) => {
    return (
      <HabitCard
        habit={item.habit}
        progressData={item.progress}
        onPress={handleHabitPress}
        onTilePress={handleTilePress}
        onTileLongPress={handleTileLongPress}
        isDragging={false}
      />
    );
  }, [handleHabitPress, handleTilePress, handleTileLongPress]);

  // Show empty state if no habits
  if (!isLoading && habitsWithProgress.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState onCreateHabit={handleCreateHabit} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={habitsWithProgress}
        keyExtractor={(item) => item.habit.id}
        renderItem={renderHabitCard}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.gradientStart}
          />
        }
      />

      {/* Floating Action Button with Gradient */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateHabit}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <MaterialCommunityIcons name="plus" size={28} color={Colors.textOnGradient} />
      </TouchableOpacity>

      {/* Level Selector Modal */}
      {selectedHabit && selectedDate && (
        <LevelSelectorModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelectLevel={handleSelectLevel}
          onDelete={handleDeleteProgress}
          levels={selectedHabit.levels}
          trackingType={selectedHabit.trackingType}
          date={selectedDate}
          currentLevel={currentLevel}
          isEditing={isEditing}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  greetingContainer: {
    marginBottom: Spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  settingsButton: {
    padding: Spacing.xs,
  },
  greetingText: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.fontSize.headline,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  dateText: {
    fontSize: Typography.fontSize.body,
    color: Colors.textSecondary,
  },
  listContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 80,
  },
  footerContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    marginTop: Spacing.lg,
  },
  brandName: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.fontSize.title,
    color: Colors.textTertiary,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: Typography.fontSize.bodySmall,
    color: Colors.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...Shadows.fab,
  },
});
