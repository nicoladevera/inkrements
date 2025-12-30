/**
 * Service for exporting application data
 */

import { Share, Platform, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import Constants from 'expo-constants';
import { getHabits } from './habitService';
import { getAllProgress } from './progressService';
import { getCurrentTimestamp, isWebPlatform } from './database';

// Maximum length for CSV cells to prevent issues
const MAX_CELL_LENGTH = 32000;

/**
 * Sanitize string for CSV
 * Escapes quotes and wraps containing commas/quotes in quotes
 */
const sanitizeForCsv = (str: string | null | undefined): string => {
    if (str === null || str === undefined) return '';
    const stringValue = String(str);

    // Truncate if too long
    const truncated = stringValue.length > MAX_CELL_LENGTH
        ? stringValue.substring(0, MAX_CELL_LENGTH)
        : stringValue;

    if (truncated.includes('"') || truncated.includes(',') || truncated.includes('\n')) {
        return `"${truncated.replace(/"/g, '""')}"`;
    }
    return truncated;
};

/**
 * Generate export data object
 */
export const getExportData = async () => {
    const habits = await getHabits();
    const progress = await getAllProgress();

    return {
        metadata: {
            exportedAt: getCurrentTimestamp(),
            appVersion: Constants.expoConfig?.version ?? '1.0.0',
            platform: Platform.OS,
        },
        habits,
        progress,
    };
};

/**
 * Generate JSON string
 */
export const generateJsonExport = async (): Promise<string> => {
    const data = await getExportData();
    return JSON.stringify(data, null, 2);
};

/**
 * Generate CSV string
 * Creates a flattened format: Date, Habit Name, Level
 */
export const generateCsvExport = async (): Promise<string> => {
    const { habits, progress } = await getExportData();

    // Create a map of habit ID to habit name for quick lookup
    const habitMap = new Map<string, string>();
    habits.forEach(h => habitMap.set(h.id, h.name));

    // Header row
    let csv = 'Date,Habit Name,Level,Habit ID,Description,Tracking Type\n';

    // Data rows
    progress.forEach(p => {
        const habitName = habitMap.get(p.habitId) || 'Unknown Habit';
        const habit = habits.find(h => h.id === p.habitId);

        csv += [
            sanitizeForCsv(p.date),
            sanitizeForCsv(habitName),
            p.level,
            sanitizeForCsv(p.habitId),
            sanitizeForCsv(habit?.description),
            sanitizeForCsv(habit?.trackingType),
        ].join(',') + '\n';
    });

    return csv;
};

/**
 * Share or download file
 * @param format 'json' | 'csv'
 * @param onShareStarted Optional callback to dismiss loading state before share sheet opens
 */
export const executeExport = async (
    format: 'json' | 'csv',
    onShareStarted?: () => void
): Promise<void> => {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `inkrements-export-${timestamp}.${format}`;

        let content: string;
        if (format === 'json') {
            content = await generateJsonExport();
        } else {
            content = await generateCsvExport();
        }

        if (isWebPlatform()) {
            // Web download
            const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            // Call callback immediately for web
            if (onShareStarted) onShareStarted();
        } else {
            // Mobile share
            const fileUri = `${FileSystem.documentDirectory}${filename}`;
            await FileSystem.writeAsStringAsync(fileUri, content);

            // Dismiss loading state before opening share sheet
            if (onShareStarted) onShareStarted();

            const canShare = await Sharing.isAvailableAsync();


            if (canShare) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: format === 'json' ? 'application/json' : 'text/csv',
                    dialogTitle: 'Export Data',
                    UTI: format === 'json' ? 'public.json' : 'public.comma-separated-values-text'
                });
            } else {
                // Fallback to standard share if expo-sharing fails or isn't available
                await Share.share({
                    message: 'Here is your Inkrements data export.',
                    url: fileUri,
                    title: 'Export Data'
                });
            }
        }
    } catch (error) {
        console.error('Export failed:', error);
        Alert.alert('Export Failed', 'An error occurred while exporting your data. Please try again.');
    }
};
