"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCalendarStore } from "@/lib/store";
import { formatDateRange } from "@/lib/time";
import { Calendar } from "lucide-react";

/**
 * Simple Date Range Picker
 * 
 * Note: For full calendar popover, install shadcn/ui calendar component:
 * npx shadcn-ui@latest add calendar popover
 */
export default function DateRangePicker() {
  const { dateRange, setDateRange } = useCalendarStore();

  const handleThisWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    
    const from = new Date(now);
    from.setDate(now.getDate() - dayOfWeek);
    from.setHours(0, 0, 0, 0);
    
    const to = new Date(now);
    to.setDate(now.getDate() + (6 - dayOfWeek));
    to.setHours(23, 59, 59, 999);
    
    setDateRange({ from, to });
  };

  const handleThisMonth = () => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    setDateRange({ from, to });
  };

  const handleNextWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    
    const from = new Date(now);
    from.setDate(now.getDate() - dayOfWeek + 7);
    from.setHours(0, 0, 0, 0);
    
    const to = new Date(now);
    to.setDate(now.getDate() + (6 - dayOfWeek) + 7);
    to.setHours(23, 59, 59, 999);
    
    setDateRange({ from, to });
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">
            {formatDateRange(dateRange.from, dateRange.to)}
          </span>
        </div>
        
        <div className="flex gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleThisWeek}
          >
            This Week
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleThisMonth}
          >
            This Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextWeek}
          >
            Next Week
          </Button>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">
        Để chọn custom date range, cài đặt shadcn/ui calendar component
      </p>
    </Card>
  );
}

