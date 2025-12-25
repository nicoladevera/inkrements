/**
 * Date manipulation and formatting utilities
 */

import {
  format,
  startOfDay,
  endOfDay,
  subDays,
  subWeeks,
  isToday as dateFnsIsToday,
  isBefore,
  isAfter,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  getDay,
  differenceInDays,
  parseISO,
  addDays,
} from 'date-fns';

// Date format constants
export const DATE_FORMAT = 'yyyy-MM-dd';
export const DISPLAY_DATE_FORMAT = 'MMM d, yyyy';
export const SHORT_MONTH_FORMAT = 'MMM';

/**
 * Get current date at start of day
 */
export const getCurrentDate = (): Date => {
  return startOfDay(new Date());
};

/**
 * Format a date to YYYY-MM-DD string
 */
export const formatDate = (date: Date): string => {
  return format(date, DATE_FORMAT);
};

/**
 * Format a date for display (e.g., "Dec 25, 2025")
 */
export const formatDisplayDate = (date: Date): string => {
  return format(date, DISPLAY_DATE_FORMAT);
};

/**
 * Parse a YYYY-MM-DD string to Date
 */
export const parseDateString = (dateString: string): Date => {
  return parseISO(dateString);
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return dateFnsIsToday(d);
};

/**
 * Check if a date is within the allowed logging range (today or past 7 days)
 */
export const isWithinLoggingRange = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const today = getCurrentDate();
  const sevenDaysAgo = subDays(today, 7);
  
  // Date must be <= today and >= 7 days ago
  return !isAfter(startOfDay(d), today) && !isBefore(startOfDay(d), sevenDaysAgo);
};

/**
 * Check if a date is in the future
 */
export const isFutureDate = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const today = getCurrentDate();
  return isAfter(startOfDay(d), today);
};

/**
 * Get date from N weeks ago
 */
export const getWeeksAgo = (weeks: number): Date => {
  return subWeeks(getCurrentDate(), weeks);
};

/**
 * Get day of week (0 = Sunday, 6 = Saturday)
 */
export const getDayOfWeek = (date: Date | string): number => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return getDay(d);
};

/**
 * Get short month name (e.g., "Jan", "Feb")
 */
export const getShortMonth = (date: Date): string => {
  return format(date, SHORT_MONTH_FORMAT);
};

/**
 * Get all dates in a week (Sunday to Saturday)
 */
export const getWeekDates = (date: Date): Date[] => {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 }); // Sunday
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });     // Saturday
  return eachDayOfInterval({ start: weekStart, end: weekEnd });
};

/**
 * Get date range for N weeks back from today
 * Returns array of dates from oldest to newest
 */
export const getDateRangeForWeeks = (weeks: number): Date[] => {
  const today = getCurrentDate();
  const startDate = subWeeks(startOfWeek(today, { weekStartsOn: 0 }), weeks - 1);
  const endDate = endOfWeek(today, { weekStartsOn: 0 });
  
  return eachDayOfInterval({ start: startDate, end: endDate });
};

/**
 * Organize dates into weeks (for grid display)
 * Returns array of weeks, each containing 7 days
 * Most recent week first
 */
export const organizeDatesIntoWeeks = (weeks: number): Date[][] => {
  const today = getCurrentDate();
  const result: Date[][] = [];
  
  // Start from the current week and go backwards
  for (let i = 0; i < weeks; i++) {
    const weekDate = subWeeks(today, i);
    const weekDates = getWeekDates(weekDate);
    result.push(weekDates);
  }
  
  return result; // Most recent week at index 0
};

/**
 * Get the start and end dates for a given number of weeks
 */
export const getDateRangeBounds = (weeks: number): { start: Date; end: Date } => {
  const today = getCurrentDate();
  const endDate = endOfWeek(today, { weekStartsOn: 0 });
  const startDate = startOfWeek(subWeeks(today, weeks - 1), { weekStartsOn: 0 });
  
  return { start: startDate, end: endDate };
};

/**
 * Calculate number of days in a date range
 */
export const getDaysInRange = (startDate: Date, endDate: Date): number => {
  return differenceInDays(endDate, startDate) + 1;
};

/**
 * Check if a date is the first day of its month
 */
export const isFirstDayOfMonth = (date: Date): boolean => {
  return date.getDate() === 1;
};

/**
 * Check if a date is a Sunday (start of week)
 */
export const isSunday = (date: Date): boolean => {
  return getDay(date) === 0;
};

/**
 * Day of week labels (short form)
 */
export const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

/**
 * Full day names
 */
export const DAY_NAMES = [
  'Sunday',
  'Monday', 
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

