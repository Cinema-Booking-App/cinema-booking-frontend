
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Calendar, Film, MapPin, Users, DollarSign, Settings, Plus } from 'lucide-react';
import { CreateShowtime } from '@/types/showtimes';
import { Movies } from '@/types/movies';
import { Theaters } from '@/types/theaters';
import { useGetRoomsByTheaterIdQuery } from '@/store/slices/rooms/roomsApi';

interface ShowtimeFormProps {
    isOpen: boolean;
    movies: Movies[];
    theaters: Theaters[];
    onOpenChange: (open: boolean) => void;
    onSubmit?: (data: CreateShowtime) => void;
}

const ShowtimeForm: React.FC<ShowtimeFormProps> = ({isOpen,movies,theaters,onOpenChange,onSubmit}) => {
    const [formData, setFormData] = useState<CreateShowtime>({
        movie_id: 0,
        theater_id: 0,
        room_id: 0,
        show_datetime: '',
        format: 'TWO_D',
        ticket_price: 0,
        status: 'active',
        language: 'sub_vi'
    });

      const { data: rooms = [], isLoading: isLoadingRooms, error: roomsError } = useGetRoomsByTheaterIdQuery(
        formData.theater_id,
        { skip: !formData.theater_id }
    );



    const [errors, setErrors] = useState<Record<string, string>>({});



    const formats = ['TWO_D', '3D', 'IMAX', '4DX'];
    const statuses = [
        { value: 'active', label: 'Hoạt động' },
        { value: 'inactive', label: 'Tạm dừng' },
        { value: 'sold_out', label: 'Hết vé' }
    ];
    const languages = [
        { value: 'sub_vi', label: 'Tiếng Việt' },
        { value: 'sub_en', label: 'Tiếng Anh' },
        { value: 'sub', label: 'Phụ đề' }
    ];

    const handleInputChange = (field: keyof CreateShowtime, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.movie_id) newErrors.movie_id = 'Vui lòng chọn phim';
        if (!formData.theater_id) newErrors.theater_id = 'Vui lòng chọn rạp';
        if (!formData.room_id) newErrors.room_id = 'Vui lòng chọn phòng';
        if (!formData.show_datetime) newErrors.show_datetime = 'Vui lòng chọn thời gian chiếu';
        if (!formData.ticket_price || formData.ticket_price <= 0)
            newErrors.ticket_price = 'Giá vé phải lớn hơn 0';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Tạo lịch chiếu:', formData);
            // Gọi callback từ component cha
            if (onSubmit) {
                onSubmit(formData);
            }
            onOpenChange(false);
            // Reset form
            setFormData({
                movie_id: 0,
                theater_id: 0,
                room_id: 0,
                show_datetime: '',
                format: '2D',
                ticket_price: 0,
                status: 'active',
                language: 'vi'
            });
        }
    };

    const filteredRooms = rooms.filter(room => room.theater_id === formData.theater_id);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>

            <DialogContent className="max-w-2xl lg:max-w-6xl  max-h-[100vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-foreground flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-destructive" />
                        Thêm Lịch Chiếu Mới
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Chọn Phim */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-foreground">
                                <Film className="w-4 h-4 mr-2 text-muted-foreground" />
                                Phim
                            </label>
                            <select
                                value={formData.movie_id}
                                onChange={(e) => handleInputChange('movie_id', Number(e.target.value))}
                                className={`w-full px-3 py-2 bg-background border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-destructive ${errors.movie_id ? 'border-destructive' : 'border-border'
                                    }`}
                            >
                                <option value={0}>Chọn phim...</option>
                                {movies.map(movie => (
                                    <option key={movie.movie_id} value={movie.movie_id}>
                                        {movie.title} ({movie.release_date})
                                    </option>
                                ))}
                            </select>
                            {errors.movie_id && (
                                <p className="text-sm text-destructive">{errors.movie_id}</p>
                            )}
                        </div>

                        {/* Chọn Rạp */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-foreground">
                                <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                                Rạp Chiếu
                            </label>
                            <select
                                value={formData.theater_id}
                                onChange={(e) => {
                                    const theaterId = Number(e.target.value);
                                    handleInputChange('theater_id', theaterId);
                                    // Reset room when theater changes
                                    handleInputChange('room_id', 0);
                                }}
                                className={`w-full px-3 py-2 bg-background border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-destructive ${errors.theater_id ? 'border-destructive' : 'border-border'
                                    }`}
                            >
                                <option value={0}>Chọn rạp...</option>
                                {theaters.map(theater => (
                                    <option key={theater.theater_id} value={theater.theater_id}>
                                        {theater.name}
                                    </option>
                                ))}
                            </select>
                            {errors.theater_id && (
                                <p className="text-sm text-destructive">{errors.theater_id}</p>
                            )}
                        </div>

                        {/* Chọn Phòng */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-foreground">
                                <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                                Phòng Chiếu
                            </label>
                            <select
                                value={formData.room_id}
                                onChange={(e) => handleInputChange('room_id', Number(e.target.value))}
                                disabled={!formData.theater_id}
                                className={`w-full px-3 py-2 bg-background border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-destructive disabled:bg-muted disabled:cursor-not-allowed ${errors.room_id ? 'border-destructive' : 'border-border'
                                    }`}
                            >
                                <option value={0}>Chọn phòng...</option>
                                {filteredRooms.map(room => (
                                    <option key={room.room_id} value={room.room_id}>
                                        {room.room_name} (Rạp {room.theater_id})
                                    </option>
                                ))}
                            </select>
                            {errors.room_id && (
                                <p className="text-sm text-destructive">{errors.room_id}</p>
                            )}
                        </div>

                        {/* Thời Gian Chiếu */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-foreground">
                                <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                                Thời Gian Chiếu
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.show_datetime}
                                onChange={(e) => handleInputChange('show_datetime', e.target.value)}
                                className={`w-full px-3 py-2 bg-background border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-destructive ${errors.show_datetime ? 'border-destructive' : 'border-border'
                                    }`}
                            />
                            {errors.show_datetime && (
                                <p className="text-sm text-destructive">{errors.show_datetime}</p>
                            )}
                        </div>

                        {/* Định Dạng */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-foreground">
                                <Settings className="w-4 h-4 mr-2 text-muted-foreground" />
                                Định Dạng
                            </label>
                            <select
                                value={formData.format}
                                onChange={(e) => handleInputChange('format', e.target.value)}
                                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-destructive"
                            >
                                {formats.map(format => (
                                    <option key={format} value={format}>
                                        {format}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Giá Vé */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-foreground">
                                <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                                Giá Vé (VNĐ)
                            </label>
                            <input
                                type="number"
                                value={formData.ticket_price}
                                onChange={(e) => handleInputChange('ticket_price', Number(e.target.value))}
                                placeholder="120000"
                                min="0"
                                step="1000"
                                className={`w-full px-3 py-2 bg-background border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-destructive ${errors.ticket_price ? 'border-destructive' : 'border-border'
                                    }`}
                            />
                            {errors.ticket_price && (
                                <p className="text-sm text-destructive">{errors.ticket_price}</p>
                            )}
                        </div>

                        {/* Trạng Thái */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Trạng Thái</label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleInputChange('status', e.target.value)}
                                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-destructive"
                            >
                                {statuses.map(status => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Ngôn Ngữ */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Ngôn Ngữ</label>
                            <select
                                value={formData.language}
                                onChange={(e) => handleInputChange('language', e.target.value)}
                                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-destructive"
                            >
                                {languages.map(lang => (
                                    <option key={lang.value} value={lang.value}>
                                        {lang.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <DialogFooter className="flex justify-end space-x-3 pt-6 border-t border-border">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="px-4 py-2 text-muted-foreground hover:text-foreground font-medium transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium rounded-lg shadow-sm transition-colors duration-200"
                        >
                            Tạo Lịch Chiếu
                        </button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShowtimeForm;