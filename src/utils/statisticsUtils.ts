/**
 * Progress statistics calculation utilities
 */

import { Progress } from '../models/Progress';
import { formatDate, getCurrentDate, getDateRangeBounds } from './dateUtils';
import { subDays, eachDayOfInterval, isAfter } from 'date-fns';

export interface ProgressStatistics {
  completedDays: number;      // Number of days with any progress logged
  totalDays: number;          // Total days in the range (up to today)
  completionRate: number;     // Percentage (0-100)
  displayText: string;        // e.g., "15/28 days completed"
}

/**
 * Calculate completion statistics for a habit within a date range
 */
export const calculateCompletionStats = (
  progressEntries: Progress[],
  weeks: number
): ProgressStatistics => {
  const { start, end } = getDateRangeBounds(weeks);
  const today = getCurrentDate();
  
  // Only count days up to today (not future dates)
  const effectiveEnd = isAfter(end, today) ? today : end;
  
  // Get all dates in the range
  const allDates = eachDayOfInterval({ start, end: effectiveEnd });
  const totalDays = allDates.length;
  
  // Create a set of dates that have progress logged
  const loggedDates = new Set(
    progressEntries
      .filter(p => p.level > 0)
      .map(p => p.date)
  );
  
  // Count completed days within the range
  const completedDays = allDates.filter(date => 
    loggedDates.has(formatDate(date))
  ).length;
  
  // Calculate completion rate
  const completionRate = totalDays > 0 
    ? Math.round((completedDays / totalDays) * 100) 
    : 0;
  
  return {
    completedDays,
    totalDays,
    completionRate,
    displayText: `${completedDays}/${totalDays} days completed`,
  };
};

/**
 * Get progress summary for the last N days
 */
export const getRecentProgressSummary = (
  progressEntries: Progress[],
  days: number = 7
): { completed: number; total: number } => {
  const today = getCurrentDate();
  const startDate = subDays(today, days - 1);
  
  const recentDates = eachDayOfInterval({ start: startDate, end: today });
  
  const loggedDates = new Set(
    progressEntries
      .filter(p => p.level > 0)
      .map(p => p.date)
  );
  
  const completed = recentDates.filter(date => 
    loggedDates.has(formatDate(date))
  ).length;
  
  return {
    completed,
    total: recentDates.length,
  };
};

/**
 * Calculate average level for level-based habits
 */
export const calculateAverageLevel = (
  progressEntries: Progress[]
): number => {
  const entriesWithProgress = progressEntries.filter(p => p.level > 0);
  
  if (entriesWithProgress.length === 0) {
    return 0;
  }
  
  const totalLevel = entriesWithProgress.reduce((sum, p) => sum + p.level, 0);
  return totalLevel / entriesWithProgress.length;
};

/**
 * Get the current streak (consecutive days with progress)
 */
export const getCurrentStreak = (progressEntries: Progress[]): number => {
  if (progressEntries.length === 0) {
    return 0;
  }
  
  // Sort entries by date (most recent first)
  const sortedEntries = [...progressEntries]
    .filter(p => p.level > 0)
    .sort((a, b) => b.date.localeCompare(a.date));
  
  if (sortedEntries.length === 0) {
    return 0;
  }
  
  const today = formatDate(getCurrentDate());
  const yesterday = formatDate(subDays(getCurrentDate(), 1));
  
  // Check if streak includes today or yesterday
  const mostRecentDate = sortedEntries[0].date;
  if (mostRecentDate !== today && mostRecentDate !== yesterday) {
    return 0; // Streak is broken
  }
  
  let streak = 1;
  let currentDate = sortedEntries[0].date;
  
  for (let i = 1; i < sortedEntries.length; i++) {
    const expectedPrevDate = formatDate(subDays(new Date(currentDate), 1));
    
    if (sortedEntries[i].date === expectedPrevDate) {
      streak++;
      currentDate = sortedEntries[i].date;
    } else {
      break;
    }
  }
  
  return streak;
};

/**
 * Format completion rate for display
 */
export const formatCompletionRate = (rate: number): string => {
  return `${Math.round(rate)}%`;
};

