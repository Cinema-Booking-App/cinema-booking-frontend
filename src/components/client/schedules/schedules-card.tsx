"use client"
import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Calendar, Clock } from "lucide-react";
import { format, addDays, isToday, isTomorrow } from "date-fns";
import { vi } from "date-fns/locale";
import { Movies } from "@/types/movies";

const cinemas = [
  {
    id: 1,
    name: "CGV Vincom Center Landmark 81",
    address: "Tầng B1-B2, Vincom Center Landmark 81, 720A Điện Biên Phủ, Bình Thạnh, TP.HCM",
    phone: "1900 6017",
    facilities: ["IMAX", "4DX", "Screenx", "Premium"],
  },
  {
    id: 2,
    name: "CGV Aeon Mall Tân Phú",
    address: "Tầng 3, Aeon Mall Tân Phú, 30 Bờ Bao Tân Thắng, Sơn Kỳ, Tân Phú, TP.HCM",
    phone: "1900 6017",
    facilities: ["IMAX", "Premium"],
  },
  {
    id: 3,
    name: "Galaxy Nguyễn Du",
    address: "116 Nguyễn Du, Quận 1, TP.HCM",
    phone: "028 7300 8881",
    facilities: ["Premium", "VIP"],
  }
];

// Tạo lịch chiếu khác nhau cho từng rạp
const generateShowTimesByCinema = (cinemaId: number, date: string) => {
  const showTimesByDate: Record<number, { time: string; format: string; seats: number }[]> = {
    1: [ // CGV Landmark 81
      { time: "09:00", format: "2D", seats: 45 },
      { time: "11:30", format: "IMAX", seats: 23 },
      { time: "14:15", format: "4DX", seats: 30 },
      { time: "16:45", format: "3D", seats: 12 },
      { time: "19:30", format: "IMAX", seats: 89 },
      { time: "22:00", format: "2D", seats: 156 },
    ],
    2: [ // CGV Aeon Mall
      { time: "10:00", format: "2D", seats: 60 },
      { time: "12:45", format: "3D", seats: 35 },
      { time: "15:30", format: "IMAX", seats: 25 },
      { time: "18:15", format: "2D", seats: 80 },
      { time: "21:00", format: "Premium", seats: 40 },
    ],
    3: [ // Galaxy Nguyễn Du
      { time: "09:30", format: "2D", seats: 55 },
      { time: "13:00", format: "VIP", seats: 18 },
      { time: "16:00", format: "2D", seats: 70 },
      { time: "19:00", format: "Premium", seats: 25 },
      { time: "21:45", format: "2D", seats: 90 },
    ]
  };

  return showTimesByDate[cinemaId] || [];
};

// Tạo danh sách 7 ngày từ hôm nay
const generateAvailableDates = () => {
  const today = new Date();
  const dates = [];

  for (let i = 0; i < 7; i++) {
    const date = addDays(today, i);
    const dateKey = format(date, 'yyyy-MM-dd');
    let label = format(date, "EEEE", { locale: vi });

    if (isToday(date)) {
      label = "Hôm nay";
    } else if (isTomorrow(date)) {
      label = "Ngày mai";
    }

    dates.push({
      date: dateKey,
      label,
      day: format(date, "dd"),
      month: format(date, "MM"),
      year: format(date, "yyyy"),
      isToday: isToday(date),
      isTomorrow: isTomorrow(date),
    });
  }

  return dates;
};

interface SchedulesCardProps {
  movie?: Movies;
}


export default function SchedulesCard({ movie }: SchedulesCardProps) {
  // Sử dụng movie từ props hoặc fallback về mock data
  const movieData = movie;
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [selectedCinema, setSelectedCinema] = useState<typeof cinemas[0] | undefined>();
  const [selectedShowtime, setSelectedShowtime] = useState<{ time: string; format: string; seats: number } | undefined>();

  // Tự động chọn ngày hôm nay làm mặc định
  const today = format(new Date(), 'yyyy-MM-dd');

  React.useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(today);
    }
  }, [selectedDate, today]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Danh sách 7 ngày từ hôm nay
  const availableDates = useMemo(() => generateAvailableDates(), []);

  // Lấy lịch chiếu theo rạp đã chọn
  const availableShowtimes = useMemo(() => {
    if (!selectedDate || !selectedCinema) return [];
    return generateShowTimesByCinema(selectedCinema.id, selectedDate);
  }, [selectedDate, selectedCinema]);

  // Reset showtime khi đổi rạp
  React.useEffect(() => {
    setSelectedShowtime(undefined);
  }, [selectedCinema]);

  return (
    <DialogContent className="max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl w-full p-0">
      <VisuallyHidden>
        <DialogTitle>Lịch chiếu phim</DialogTitle>
      </VisuallyHidden>
      <Card className="shadow-none border-0 overflow-hidden w-full">
        <CardTitle className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">
          <span className="font-medium text-center line-clamp-2">{movieData ? movieData.title : ""}</span>
        </CardTitle>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-4 pt-0">

            {/* Chọn ngày */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <h3 className="text-base sm:text-lg font-semibold">Chọn ngày chiếu</h3>
              </div>
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 px-1 scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
                {availableDates.map(({ date, label, day, month, year, isToday, isTomorrow }) => (
                  <Button
                    key={date}
                    type="button"
                    variant={selectedDate === date ? "default" : "outline"}
                    className={`flex flex-col items-center justify-center m-1 min-w-[60px] sm:min-w-[70px] h-16 sm:h-16 rounded-lg sm:rounded-xl whitespace-nowrap transition-all duration-200 ${selectedDate === date
                      ? "ring-1 sm:ring-2 ring-primary shadow-md sm:shadow-lg scale-105"
                      : "hover:shadow-sm sm:hover:shadow-md hover:scale-102"
                      } ${isToday ? "border-primary" : ""}`}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedShowtime(undefined);
                    }}
                  >
                    <span className="text-lg sm:text-xl font-bold leading-none">{day}</span>
                    <span className="text-xs text-muted-foreground">{month}/{year}</span>
                  </Button>
                ))}
              </div>
            </div>
            {/* Chọn rạp - chỉ hiển thị khi đã chọn ngày */}
            {selectedDate && (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-base sm:text-lg font-semibold">Chọn rạp chiếu</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                  {cinemas.map((cinema) => (
                    <Button
                      key={cinema.id}
                      type="button"
                      variant={selectedCinema?.id === cinema.id ? "default" : "outline"}
                      className={`p-3 h-auto text-left justify-start transition-all duration-200 ${selectedCinema?.id === cinema.id
                        ? "ring-1 sm:ring-2 ring-primary shadow-md"
                        : "hover:shadow-sm"
                        }`}
                      onClick={() => setSelectedCinema(cinema)}
                    >
                      <div className="flex flex-col items-start">
                        <div className="font-semibold text-sm sm:text-base">{cinema.name}</div>
                        {/* <div className="text-xs text-muted-foreground line-clamp-2 mt-1 overflow-hidden text-ellipsis">
                          {cinema.address}
                        </div> */}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {/* Chọn suất chiếu - chỉ hiển thị khi đã chọn ngày và rạp */}
            {selectedDate && (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <h3 className="text-base sm:text-lg font-semibold">Chọn suất chiếu</h3>
                </div>

                {selectedCinema ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                    {availableShowtimes.map((showtime) => (
                      <Button
                        key={`${showtime.time}-${showtime.format}`}
                        type="button"
                        variant={
                          selectedShowtime?.time === showtime.time && selectedShowtime?.format === showtime.format
                            ? "default"
                            : "outline"
                        }
                        className={`flex flex-col items-center justify-center p-2 sm:p-4 h-auto space-y-1 sm:space-y-2 transition-all duration-200 ${selectedShowtime?.time === showtime.time && selectedShowtime?.format === showtime.format
                          ? "ring-1 sm:ring-2 ring-primary shadow-md sm:shadow-lg"
                          : "hover:shadow-sm sm:hover:shadow-md"
                          }`}
                        onClick={() => setSelectedShowtime(showtime)}
                      >
                        <div className="text-base sm:text-lg font-bold">{showtime.time}</div>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground">
                    <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm sm:text-base">Vui lòng chọn rạp để xem suất chiếu</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="p-3 sm:p-4 pt-0">
            <Button
              type="submit"
              size="lg"
              className="w-full h-10 sm:h-12 text-sm sm:text-base font-semibold"
              disabled={!selectedCinema || !selectedDate || !selectedShowtime}
            >
              {selectedCinema && selectedDate && selectedShowtime
                ? "Tiếp tục chọn ghế"
                : "Vui lòng chọn đầy đủ thông tin"
              }
            </Button>
          </CardFooter>
        </form>
      </Card>
    </DialogContent>
  );
}