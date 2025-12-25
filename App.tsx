/**
 * Inkrements - Habit Tracker App
 * Main entry point with navigation setup
 */

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Colors } from './src/constants/colors';
import { initializeDatabase } from './src/services/database';
import { HomeScreen } from './src/screens/HomeScreen';
import { HabitDetailScreen } from './src/screens/HabitDetailScreen';
import { CreateHabitScreen } from './src/screens/CreateHabitScreen';

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  HabitDetail: { habitId: string };
  CreateHabit: { habitId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Loading screen component
const LoadingScreen: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={Colors.textPrimary} />
    <Text style={styles.loadingText}>Loading Inkrements...</Text>
  </View>
);

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase();
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize database:', err);
        setError('Failed to initialize the app. Please restart.');
      }
    };

    init();
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.background,
            },
            headerTintColor: Colors.textPrimary,
            headerTitleStyle: {
              fontWeight: '600',
            },
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: Colors.background,
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Inkrements',
              headerLargeTitle: true,
            }}
          />
          <Stack.Screen
            name="HabitDetail"
            component={HabitDetailScreen}
            options={{
              title: 'Habit Details',
            }}
          />
          <Stack.Screen
            name="CreateHabit"
            component={CreateHabitScreen}
            options={{
              title: 'Create Habit',
              presentation: 'modal',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
  },
});
