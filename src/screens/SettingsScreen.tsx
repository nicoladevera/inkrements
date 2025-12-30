/**
 * Settings Screen
 * Features data export and app information
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';


import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing, BorderRadius } from '../constants/spacing';
import { executeExport } from '../services/exportService';

export const SettingsScreen: React.FC = () => {
    const navigation = useNavigation();
    const [isExporting, setIsExporting] = useState(false);

    // Handle export action
    const handleExport = async (format: 'json' | 'csv') => {
        if (isExporting) return;

        setIsExporting(true);
        // Add a small delay to allow UI to update to loading state
        setTimeout(async () => {
            await executeExport(format, () => setIsExporting(false));
        }, 100);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>


                {/* Data Management Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data Management</Text>
                    <View style={styles.card}>
                        <TouchableOpacity
                            style={[styles.row, styles.borderBottom]}
                            onPress={() => handleExport('json')}
                            disabled={isExporting}
                        >
                            <View style={styles.rowIcon}>
                                <MaterialCommunityIcons name="code-json" size={24} color={Colors.textPrimary} />
                            </View>
                            <View style={styles.rowContent}>
                                <Text style={styles.rowTitle}>Export as JSON</Text>
                                <Text style={styles.rowSubtitle}>Full backup of your habits and progress</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.textTertiary} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.row}
                            onPress={() => handleExport('csv')}
                            disabled={isExporting}
                        >
                            <View style={styles.rowIcon}>
                                <MaterialCommunityIcons name="table" size={24} color={Colors.textPrimary} />
                            </View>
                            <View style={styles.rowContent}>
                                <Text style={styles.rowTitle}>Export as CSV</Text>
                                <Text style={styles.rowSubtitle}>Spreadsheet friendly format</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.textTertiary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Export Loading Indicator */}
                {isExporting && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color={Colors.accent} />
                        <Text style={styles.loadingText}>Exporting data...</Text>
                    </View>
                )}

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <View style={styles.aboutCard}>
                        <Text style={styles.brandName}>Inkrements</Text>
                        <Text style={styles.tagline}>Ink your progress, one increment at a time.</Text>

                        <View style={styles.divider} />

                        <Text style={styles.missionText}>
                            Inkrements combines the mindful act of 'inking' progress with the power of small, consistent increments. Track what matters, see your progress unfold, and celebrate the daily habits and wins that lead to lasting change.
                        </Text>

                        <View style={styles.versionContainer}>
                            <Text style={styles.versionText}>Version {Constants.expoConfig?.version ?? '1.0.0'}</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    header: {
        marginBottom: Spacing.xl,
    },
    headerTitle: {
        fontFamily: Typography.fontFamily.serif,
        fontSize: 32,
        color: Colors.textPrimary,
    },
    section: {
        marginBottom: Spacing.xxl,
    },
    sectionTitle: {
        fontSize: Typography.fontSize.caption,
        fontWeight: Typography.fontWeight.semibold,
        color: Colors.textSecondary,
        marginBottom: Spacing.md,
        textTransform: 'uppercase',
        letterSpacing: Typography.letterSpacing.wide,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.card,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    rowIcon: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.icon,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    rowContent: {
        flex: 1,
    },
    rowTitle: {
        fontSize: Typography.fontSize.bodyLarge,
        fontWeight: Typography.fontWeight.medium,
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    rowSubtitle: {
        fontSize: Typography.fontSize.caption,
        color: Colors.textTertiary,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        borderRadius: BorderRadius.card,
    },
    loadingText: {
        marginTop: Spacing.md,
        fontSize: Typography.fontSize.body,
        color: Colors.textSecondary,
        fontWeight: Typography.fontWeight.medium,
    },
    aboutCard: {
        padding: Spacing.xl,
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.card,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
    },
    brandName: {
        fontFamily: Typography.fontFamily.serif,
        fontSize: Typography.fontSize.title,
        color: Colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    tagline: {
        fontSize: Typography.fontSize.bodySmall,
        color: Colors.textTertiary,
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: Spacing.lg,
    },
    divider: {
        width: 40,
        height: 2,
        backgroundColor: Colors.border,
        marginBottom: Spacing.lg,
    },
    missionText: {
        fontSize: Typography.fontSize.body,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: Spacing.xl,
    },
    versionContainer: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.pill,
    },
    versionText: {
        fontSize: Typography.fontSize.caption,
        color: Colors.textTertiary,
        fontWeight: Typography.fontWeight.medium,
    },
});
