/**
 * Format an ISO date string to a localized readable format
 * @param isoString - ISO 8601 date string
 * @returns Formatted date string with weekday, hour, and minute
 */
export const formatEventTime = (isoString: string): string => {
    return new Date(isoString).toLocaleString(undefined, {
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });
};

/**
 * Format a date for display in a short format
 * @param date - Date object or ISO string
 * @returns Short formatted date string
 */
export const formatShortDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

/**
 * Format a time for display
 * @param date - Date object or ISO string
 * @returns Time string
 */
export const formatTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });
};
