'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, X } from 'lucide-react';
import {
  format,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameDay,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';

export function CheckInFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // local state for debounce
  const [name, setName] = useState(searchParams.get('name') || '');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [userId, setUserId] = useState(searchParams.get('userId') || '');

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const start = searchParams.get('startDate');
    const end = searchParams.get('endDate');
    if (start && end) {
      return { from: new Date(start), to: new Date(end) };
    }
    return undefined;
  });

  const [isCustomOpen, setIsCustomOpen] = useState(false);

  // Debounce text inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ name, email, userId });
    }, 500);
    return () => clearTimeout(timer);
  }, [name, email, userId]);

  const updateFilters = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset page to 1 on filter change - handled by React Query key change usually,
    // but good practice if we were manual.
    // Since we are using infinite scroll, the query key change will reset the list.

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDatePreset = (preset: 'today' | 'week' | 'month') => {
    const now = new Date();
    let range: DateRange | undefined;

    switch (preset) {
      case 'today':
        range = { from: startOfDay(now), to: endOfDay(now) };
        break;
      case 'week':
        range = { from: startOfWeek(now), to: endOfWeek(now) };
        break;
      case 'month':
        range = { from: startOfMonth(now), to: endOfMonth(now) };
        break;
    }

    if (range?.from && range?.to) {
      setDateRange(range);
      updateFilters({
        startDate: range.from.toISOString(),
        endDate: range.to.toISOString(),
      });
      setIsCustomOpen(false);
    }
  };

  const handleCustomSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      updateFilters({
        startDate: range.from.toISOString(),
        endDate: range.to.toISOString(),
      });
      // Don't close immediately so they can see selection
    } else if (!range) {
      updateFilters({ startDate: undefined, endDate: undefined });
    }
  };

  const clearFilters = () => {
    setName('');
    setEmail('');
    setUserId('');
    setDateRange(undefined);
    router.push(pathname);
  };

  const hasActiveFilters = name || email || userId || dateRange;

  // Helpers to determine active state of buttons
  const isToday =
    dateRange?.from &&
    dateRange?.to &&
    isSameDay(dateRange.from, startOfDay(new Date())) &&
    isSameDay(dateRange.to, endOfDay(new Date()));

  const isThisWeek =
    dateRange?.from &&
    dateRange?.to &&
    isSameDay(dateRange.from, startOfWeek(new Date())) &&
    isSameDay(dateRange.to, endOfWeek(new Date()));

  const isThisMonth =
    dateRange?.from &&
    dateRange?.to &&
    isSameDay(dateRange.from, startOfMonth(new Date())) &&
    isSameDay(dateRange.to, endOfMonth(new Date()));

  const isCustom = dateRange && !isToday && !isThisWeek && !isThisMonth;

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Input
            placeholder="Filter by name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-9"
          />
        </div>

        {/* Date Filters */}
        <div className="flex items-center gap-2">
          <Button
            variant={isToday ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleDatePreset('today')}
            className="h-9"
          >
            Today
          </Button>
          <Button
            variant={isThisWeek ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleDatePreset('week')}
            className="h-9"
          >
            This Week
          </Button>
          <Button
            variant={isThisMonth ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleDatePreset('month')}
            className="h-9"
          >
            This Month
          </Button>

          <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={isCustom ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'h-9',
                  isCustom && 'bg-primary text-primary-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {isCustom && dateRange?.from && dateRange?.to ? (
                  <>
                    {format(dateRange.from, 'LLL dd')} -{' '}
                    {format(dateRange.to, 'LLL dd')}
                  </>
                ) : (
                  'Custom'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleCustomSelect}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="h-9 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
