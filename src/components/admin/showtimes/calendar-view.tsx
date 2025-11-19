'use client';

import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, Film, MapPin } from 'lucide-react';
import { Showtimes } from '@/types/showtimes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';

interface CalendarViewProps {
    showtimes: Showtimes[];
    onShowtimeClick?: (showtime: Showtimes) => void;
    onDateSelect?: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
    showtimes = [],
    onShowtimeClick,
    onDateSelect
}) => {
    const [currentWeekStart, setCurrentWeekStart] = React.useState<Date>(
        startOfWeek(new Date(), { weekStartsOn: 1 })
    );

    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
    }, [currentWeekStart]);

    const showtimesByDate = useMemo(() => {
        const grouped: Record<string, Showtimes[]> = {};

        showtimes.forEach(showtime => {
            const dateKey = format(new Date(showtime.show_datetime), 'yyyy-MM-dd');
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(showtime);
        });

        // Sort showtimes by time
        Object.keys(grouped).forEach(key => {
            grouped[key].sort((a, b) =>
                new Date(a.show_datetime).getTime() - new Date(b.show_datetime).getTime()
            );
        });

        return grouped;
    }, [showtimes]);

    const goToPreviousWeek = () => {
        setCurrentWeekStart(prev => addDays(prev, -7));
    };

    const goToNextWeek = () => {
        setCurrentWeekStart(prev => addDays(prev, 7));
    };

    const goToToday = () => {
        setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
            default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        }
    };

    const getFormatBadge = (format: string) => {
        const colors: Record<string, string> = {
            'TWO_D': 'bg-blue-100 text-blue-800',
            '3D': 'bg-purple-100 text-purple-800',
            'IMAX': 'bg-orange-100 text-orange-800',
            '4DX': 'bg-pink-100 text-pink-800'
        };
        return colors[format] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousWeek}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToToday}
                    >
                        Hôm nay
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextWeek}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>

                    <h2 className="text-lg font-semibold">
                        {format(currentWeekStart, 'dd/MM/yyyy', { locale: vi })} -{' '}
                        {format(addDays(currentWeekStart, 6), 'dd/MM/yyyy', { locale: vi })}
                    </h2>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>Đang chiếu</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>Đã hủy</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                        <span>Hoàn tất</span>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 min-h-[600px]">
                {weekDays.map((day, index) => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const dayShowtimes = showtimesByDate[dateKey] || [];
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div
                            key={index}
                            className={`border rounded-lg overflow-hidden ${
                                isToday ? 'border-red-500 border-2' : 'border-gray-200'
                            }`}
                        >
                            {/* Day Header */}
                            <div
                                className={`p-2 text-center ${
                                    isToday
                                        ? 'bg-red-600 text-white'
                                        : 'bg-muted'
                                }`}
                                onClick={() => onDateSelect?.(day)}
                            >
                                <div className="text-xs font-medium uppercase">
                                    {format(day, 'EEEEEE', { locale: vi })}
                                </div>
                                <div className="text-lg font-bold">
                                    {format(day, 'd')}
                                </div>
                                <div className="text-xs">
                                    {dayShowtimes.length} suất
                                </div>
                            </div>

                            {/* Showtimes */}
                            <div className="p-1 space-y-1 max-h-[500px] overflow-y-auto">
                                {dayShowtimes.length === 0 ? (
                                    <div className="text-center text-xs text-muted-foreground py-4">
                                        Chưa có lịch
                                    </div>
                                ) : (
                                    dayShowtimes.map((showtime) => (
                                        <div
                                            key={showtime.showtime_id}
                                            onClick={() => onShowtimeClick?.(showtime)}
                                            className={`p-2 rounded border cursor-pointer hover:shadow-md transition-all text-xs space-y-1 ${
                                                showtime.status === 'cancelled'
                                                    ? 'bg-red-50 border-red-200 opacity-60'
                                                    : showtime.status === 'completed'
                                                    ? 'bg-gray-50 border-gray-200'
                                                    : 'bg-white border-gray-200 hover:border-red-300'
                                            }`}
                                        >
                                            {/* Time */}
                                            <div className="flex items-center gap-1 font-semibold text-red-600">
                                                <Clock className="w-3 h-3" />
                                                {format(new Date(showtime.show_datetime), 'HH:mm')}
                                            </div>

                                            {/* Movie */}
                                            <div className="flex items-start gap-1">
                                                <Film className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                <span className="line-clamp-2 font-medium">
                                                    {showtime.movie?.title || 'N/A'}
                                                </span>
                                            </div>

                                            {/* Theater & Room */}
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">
                                                    {showtime.room?.room_name}
                                                </span>
                                            </div>

                                            {/* Format & Price */}
                                            <div className="flex items-center justify-between">
                                                <Badge className={`text-[10px] px-1 py-0 ${getFormatBadge(showtime.format)}`}>
                                                    {showtime.format}
                                                </Badge>
                                                <span className="text-[10px] font-semibold">
                                                    {new Intl.NumberFormat('vi-VN').format(showtime.ticket_price)}đ
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;
