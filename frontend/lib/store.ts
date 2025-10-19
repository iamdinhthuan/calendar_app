/**
 * Zustand store for UI state management
 */
import { create } from "zustand";
import { CalendarEvent } from "./api";

interface DateRange {
  from: Date;
  to: Date;
}

interface CalendarStore {
  // State
  dateRange: DateRange;
  events: CalendarEvent[] | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setDateRange: (range: DateRange) => void;
  setEvents: (events: CalendarEvent[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetEvents: () => void;
}

/**
 * Get default week range (current week)
 */
function getDefaultWeekRange(): DateRange {
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

export const useCalendarStore = create<CalendarStore>((set) => ({
  // Initial state
  dateRange: getDefaultWeekRange(),
  events: null,
  loading: false,
  error: null,
  
  // Actions
  setDateRange: (range) => set({ dateRange: range }),
  setEvents: (events) => set({ events, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, events: null }),
  resetEvents: () => set({ events: null, error: null, loading: false }),
}));

