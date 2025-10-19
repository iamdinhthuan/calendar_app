"use client";

import { CalendarEvent } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatEventTime } from "@/lib/time";
import { Calendar, Users, Clock } from "lucide-react";

interface EventsListProps {
  events: CalendarEvent[] | null;
  loading: boolean;
  error: string | null;
}

export default function EventsList({ events, loading, error }: EventsListProps) {
  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          <strong>Error:</strong> {error}
        </AlertDescription>
      </Alert>
    );
  }

  // Empty state
  if (events && events.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg font-medium text-muted-foreground">
          No events found
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          No calendar events in the selected date range
        </p>
      </Card>
    );
  }

  // No data yet
  if (!events) {
    return (
      <Card className="p-12 text-center">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg font-medium text-muted-foreground">
          Select a date range and click "Fetch Events"
        </p>
      </Card>
    );
  }

  // Events list
  return (
    <div className="space-y-3">
      {events.map((event) => (
        <Card key={event.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {event.summary || "(No title)"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <div className="font-medium">
                  {formatEventTime(event.start)}
                </div>
                <div className="text-muted-foreground text-xs">
                  to {formatEventTime(event.end)}
                </div>
              </div>
            </div>
            
            {event.attendees && event.attendees.length > 0 && (
              <div className="flex items-start gap-2 text-sm">
                <Users className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-muted-foreground text-xs">
                    {event.attendees.length} attendee{event.attendees.length > 1 ? "s" : ""}
                  </div>
                  <div className="text-xs opacity-70 truncate">
                    {event.attendees.slice(0, 3).join(", ")}
                    {event.attendees.length > 3 && ` +${event.attendees.length - 3} more`}
                  </div>
                </div>
              </div>
            )}
            
            {event.calendarId && event.calendarId !== "primary" && (
              <div className="text-xs text-muted-foreground">
                Calendar: {event.calendarId}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

