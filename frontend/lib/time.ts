/**
 * Time and timezone utilities
 */
import { format, parseISO } from "date-fns";

export const DEFAULT_TIMEZONE = "Asia/Bangkok";

/**
 * Get start and end of current week
 * 
 * @param timezone - IANA timezone name
 * @returns Object with from and to dates
 */
export function getWeekRange(timezone: string = DEFAULT_TIMEZONE): {
  from: Date;
  to: Date;
} {
  const now = new Date();
  const dayOfWeek = now.getDay();
  
  // Start of week (Sunday)
  const from = new Date(now);
  from.setDate(now.getDate() - dayOfWeek);
  from.setHours(0, 0, 0, 0);
  
  // End of week (Saturday)
  const to = new Date(now);
  to.setDate(now.getDate() + (6 - dayOfWeek));
  to.setHours(23, 59, 59, 999);
  
  return { from, to };
}

/**
 * Format Date object to ISO string for API
 * 
 * @param date - Date to format
 * @returns ISO 8601 string
 */
export function formatDateForAPI(date: Date): string {
  return date.toISOString();
}

/**
 * Format event time for display
 * 
 * @param isoString - ISO 8601 date string
 * @param timezone - IANA timezone name (not used in simple version)
 * @returns Formatted string (e.g., "Jan 15, 2025 9:00 AM")
 */
export function formatEventTime(
  isoString: string,
  timezone: string = DEFAULT_TIMEZONE
): string {
  try {
    // Check if it's all-day event (date only, no time)
    if (isoString.length === 10) {
      const date = parseISO(isoString);
      return format(date, "MMM d, yyyy");
    }
    
    // Parse ISO string to Date (will use local timezone)
    const date = parseISO(isoString);
    return format(date, "MMM d, yyyy h:mm a");
  } catch {
    return isoString; // Fallback to raw string if parsing fails
  }
}

/**
 * Format date range for display
 * 
 * @param from - Start date
 * @param to - End date
 * @returns Formatted range string
 */
export function formatDateRange(from: Date, to: Date): string {
  const fromStr = format(from, "MMM d, yyyy");
  const toStr = format(to, "MMM d, yyyy");
  
  // Same day
  if (fromStr === toStr) {
    return fromStr;
  }
  
  // Same month and year
  if (from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear()) {
    return `${format(from, "MMM d")} - ${format(to, "d, yyyy")}`;
  }
  
  // Different months
  return `${fromStr} - ${toStr}`;
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

