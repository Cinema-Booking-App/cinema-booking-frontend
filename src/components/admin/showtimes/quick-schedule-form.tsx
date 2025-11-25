'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Calendar, Film, MapPin, Copy, Plus, Trash2 } from 'lucide-react';
import { CreateShowtime } from '@/types/showtimes';
import { Movies } from '@/types/movies';
import { Theaters } from '@/types/theaters';
import { useGetRoomsByTheaterIdQuery } from '@/store/slices/rooms/roomsApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface QuickScheduleFormProps {
    isOpen: boolean;
    movies: Movies[];
    theaters: Theaters[];
    onOpenChange: (open: boolean) => void;
    onSubmit?: (data: CreateShowtime[]) => void;
}

interface TimeSlot {
    id: string;
    time: string;
}

const QuickScheduleForm: React.FC<QuickScheduleFormProps> = ({
    isOpen,
    movies,
    theaters,
    onOpenChange,
    onSubmit
}) => {
    const [selectedMovie, setSelectedMovie] = useState<number>(0);
    const [selectedTheater, setSelectedTheater] = useState<number>(0);
    const [selectedRoom, setSelectedRoom] = useState<number>(0);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [ticketPrice, setTicketPrice] = useState<number>(120000);
    const [format, setFormat] = useState<string>('TWO_D');
    const [language, setLanguage] = useState<string>('sub_vi');

    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
        { id: '1', time: '09:00' },
        { id: '2', time: '11:30' },
        { id: '3', time: '14:00' },
        { id: '4', time: '16:30' },
        { id: '5', time: '19:00' },
        { id: '6', time: '21:30' }
    ]);

    const { data: rooms = [] } = useGetRoomsByTheaterIdQuery(
        selectedTheater,
        { skip: !selectedTheater }
    );

    const addTimeSlot = () => {
        const newId = (timeSlots.length + 1).toString();
        setTimeSlots([...timeSlots, { id: newId, time: '' }]);
    };

    const removeTimeSlot = (id: string) => {
        if (timeSlots.length > 1) {
            setTimeSlots(timeSlots.filter(slot => slot.id !== id));
        }
    };

    const updateTimeSlot = (id: string, time: string) => {
        setTimeSlots(timeSlots.map(slot =>
            slot.id === id ? { ...slot, time } : slot
        ));
    };

    const duplicateTimeSlots = () => {
        const lastTime = timeSlots[timeSlots.length - 1]?.time || '09:00';
        const [hours, minutes] = lastTime.split(':').map(Number);
        const newHours = (hours + 2) % 24;
        const newTime = `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

        const newId = (timeSlots.length + 1).toString();
        setTimeSlots([...timeSlots, { id: newId, time: newTime }]);
    };

    const handleSubmit = () => {
        if (!selectedMovie || !selectedTheater || !selectedRoom || !selectedDate) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        const showtimes: CreateShowtime[] = timeSlots
            .filter(slot => slot.time)
            .map(slot => ({
                movie_id: selectedMovie,
                theater_id: selectedTheater,
                room_id: selectedRoom,
                show_datetime: `${selectedDate}T${slot.time}:00`,
                format: format,
                ticket_price: ticketPrice,
                status: 'active',
                language: language
            }));

        if (showtimes.length === 0) {
            alert('Vui lòng thêm ít nhất 1 khung giờ');
            return;
        }

        if (onSubmit) {
            onSubmit(showtimes);
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-red-600" />
                        Tạo Nhanh Lịch Chiếu
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Tạo nhiều suất chiếu cùng lúc trong 1 ngày
                    </p>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Thông tin cơ bản */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium">
                                <Film className="w-4 h-4 mr-2" />
                                Phim *
                            </label>
                            <select
                                value={selectedMovie}
                                onChange={(e) => setSelectedMovie(Number(e.target.value))}
                                className="w-full px-3 py-2 border rounded-md"
                            >
                                <option value={0}>Chọn phim...</option>
                                {movies.map(movie => (
                                    <option key={movie.movie_id} value={movie.movie_id}>
                                        {movie.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium">
                                <Calendar className="w-4 h-4 mr-2" />
                                Ngày chiếu *
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium">
                                <MapPin className="w-4 h-4 mr-2" />
                                Rạp *
                            </label>
                            <select
                                value={selectedTheater}
                                onChange={(e) => {
                                    setSelectedTheater(Number(e.target.value));
                                    setSelectedRoom(0);
                                }}
                                className="w-full px-3 py-2 border rounded-md"
                            >
                                <option value={0}>Chọn rạp...</option>
                                {theaters.map(theater => (
                                    <option key={theater.theater_id} value={theater.theater_id}>
                                        {theater.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phòng chiếu *</label>
                            <select
                                value={selectedRoom}
                                onChange={(e) => setSelectedRoom(Number(e.target.value))}
                                disabled={!selectedTheater}
                                className="w-full px-3 py-2 border rounded-md disabled:bg-muted"
                            >
                                <option value={0}>Chọn phòng...</option>
                                {rooms.map(room => (
                                    <option key={room.room_id} value={room.room_id}>
                                        {room.room_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Định dạng</label>
                            <select
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                            >
                                <option value="TWO_D">2D</option>
                                <option value="3D">3D</option>
                                <option value="IMAX">IMAX</option>
                                <option value="4DX">4DX</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Giá vé (VNĐ)</label>
                            <input
                                type="number"
                                value={ticketPrice}
                                onChange={(e) => setTicketPrice(Number(e.target.value))}
                                className="w-full px-3 py-2 border rounded-md"
                                min="0"
                                step="1000"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Ngôn ngữ</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                            >
                                <option value="sub_vi">Phụ đề Việt</option>
                                <option value="sub_en">Phụ đề Anh</option>
                                <option value="dub_vi">Lồng tiếng Việt</option>
                            </select>
                        </div>
                    </div>

                    {/* Khung giờ chiếu */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-base">Khung giờ chiếu</h3>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={duplicateTimeSlots}
                                    className="gap-2"
                                >
                                    <Copy className="w-4 h-4" />
                                    Nhân đôi
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addTimeSlot}
                                    className="gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Thêm giờ
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
                            {timeSlots.map((slot) => (
                                <div key={slot.id} className="relative flex flex-col items-center bg-white dark:bg-muted rounded-md shadow-sm p-2">
                                    {/* <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeTimeSlot(slot.id)}
                                        disabled={timeSlots.length === 1}
                                        className="absolute top-1 right-1 h-7 w-7 z-10"
                                        aria-label="Xóa khung giờ"
                                    > */}
                                        <Trash2 className="w-4 h-4 text-red-500 absolute top-6 right-1 z-10"   onClick={() => removeTimeSlot(slot.id)}/>
                                    {/* </Button> */}
                                    <Input
                                        type="time"
                                        value={slot.time}
                                        onChange={(e) => updateTimeSlot(slot.id, e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md text-sm mt-5"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Xem trước */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <h4 className="font-medium text-sm mb-2">📋 Xem trước:</h4>
                        <p className="text-sm text-muted-foreground">
                            Sẽ tạo <span className="font-bold text-blue-600">{timeSlots.filter(s => s.time).length} suất chiếu</span> cho ngày {selectedDate || '(chưa chọn)'}
                        </p>
                    </div>
                </div>

                <DialogFooter className="flex gap-2 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Tạo {timeSlots.filter(s => s.time).length} suất chiếu
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default QuickScheduleForm;
