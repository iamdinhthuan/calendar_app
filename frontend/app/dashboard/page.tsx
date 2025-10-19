"use client";

import { useState } from "react";
import HeaderBar from "@/components/HeaderBar";
import DateRangePicker from "@/components/DateRangePicker";
import EventsList from "@/components/EventsList";
import { Button } from "@/components/ui/button";
import { useCalendarStore } from "@/lib/store";
import { calendarApi } from "@/lib/api";
import { formatDateForAPI } from "@/lib/time";
import { RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const {
    dateRange,
    events,
    loading,
    error,
    setEvents,
    setLoading,
    setError,
  } = useCalendarStore();

  const [isFetching, setIsFetching] = useState(false);

  const fetchEvents = async () => {
    try {
      setIsFetching(true);
      setLoading(true);
      setError(null);

      const response = await calendarApi.getEvents({
        timeMin: formatDateForAPI(dateRange.from),
        timeMax: formatDateForAPI(dateRange.to),
        timezone: "Asia/Bangkok",
      });

      setEvents(response.events);
    } catch (err: any) {
      console.error("Failed to fetch events:", err);
      setError(err.message || "Failed to fetch calendar events");
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderBar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Calendar Events</h1>
            <p className="text-muted-foreground">
              Select a date range and fetch your Google Calendar events
            </p>
          </div>

          {/* Date Range Picker */}
          <DateRangePicker />

          {/* Fetch Button */}
          <div className="flex gap-3">
            <Button
              onClick={fetchEvents}
              disabled={loading}
              size="lg"
              className="flex-1 sm:flex-none"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Fetching..." : "Fetch Events"}
            </Button>
          </div>

          {/* Events List */}
          <EventsList
            events={events}
            loading={loading}
            error={error}
          />

          {/* Event count */}
          {events && events.length > 0 && (
            <p className="text-sm text-muted-foreground text-center">
              Showing {events.length} event{events.length > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

