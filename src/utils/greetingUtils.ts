/**
 * Greeting utilities for personalized messages
 */

/**
 * Get a time-based greeting based on the current hour
 */
export const getTimeBasedGreeting = (): string => {
    const hour = new Date().getHours();

    if (hour < 12) {
        return 'Good morning';
    } else if (hour < 17) {
        return 'Good afternoon';
    } else {
        return 'Good evening';
    }
};

/**
 * Get formatted date string like "Thursday, December 25"
 */
export const getFormattedDate = (): string => {
    const now = new Date();

    return now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });
};
