/**
 * Home screen displaying all habits with 4-week grids
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Text,
  Alert,
  FlatList,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '../constants/colors';
import { Habit } from '../models/Habit';
import { Progress } from '../models/Progress';
import { HabitCard } from '../components/HabitCard';
import { EmptyState } from '../components/EmptyState';
import { LevelSelectorModal } from '../components/LevelSelectorModal';
import { getHabits, reorderHabits } from '../services/habitService';
import { getProgressForHabits, logProgress, deleteProgressForDate, getProgressForDate } from '../services/progressService';
import { formatDate, getCurrentDate } from '../utils/dateUtils';
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
      <View style={styles.container}>
        <EmptyState onCreateHabit={handleCreateHabit} />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        data={habitsWithProgress}
        keyExtractor={(item) => item.habit.id}
        renderItem={renderHabitCard}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.textSecondary}
          />
        }
      />
      
      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateHabit}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="plus" size={28} color={Colors.white} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

