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
import { useGetTheaterInCityQuery, useGetListTheatersQuery } from "@/store/slices/theaters/theatersApi";
import { useGetShowtimesByMovieQuery } from "@/store/slices/showtimes/showtimesApi";
import { Theaters } from "@/types/theaters";
import { Showtimes } from "@/types/showtimes";
import { useAppDispatch } from "@/store/store";
import { setBookingData } from "@/store/slices/booking/bookingSlice";
import { useRouter } from "next/navigation";





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
  const [selectedCity, setSelectedCity] = useState<string | undefined>();
  const [selectedCinema, setSelectedCinema] = useState<Theaters | undefined>();
  const [selectedShowtime, setSelectedShowtime] = useState<Showtimes | undefined>();
  
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Lấy danh sách thành phố từ API
  const { data: cities, isLoading: citiesLoading } = useGetTheaterInCityQuery("");

  // Lấy danh sách tất cả rạp
  const { data: allTheaters, isLoading: theatersLoading } = useGetListTheatersQuery();

  // Lọc rạp theo thành phố đã chọn
  const theatersInSelectedCity = useMemo(() => {
    if (!selectedCity || !allTheaters) return [];
    return allTheaters.filter(theater => theater.city === selectedCity);
  }, [selectedCity, allTheaters]);

  // Lấy suất chiếu từ API
  const { data: showtimesData, isLoading: showtimesLoading } = useGetShowtimesByMovieQuery(
    {
      movieId: movieData?.movie_id || 0,
      theaterId: selectedCinema?.theater_id,
      showDate: selectedDate
    },
    {
      skip: !movieData?.movie_id || !selectedDate
    }
  );

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

  // Lấy suất chiếu đã lọc từ API
  const availableShowtimes = useMemo(() => {
    if (!showtimesData || !selectedCinema) return [];
    return showtimesData.filter(showtime =>
      showtime.theater_id === selectedCinema.theater_id
    );
  }, [showtimesData, selectedCinema]);

  // Reset showtime khi đổi rạp hoặc thành phố
  React.useEffect(() => {
    setSelectedShowtime(undefined);
  }, [selectedCinema]);

  React.useEffect(() => {
    setSelectedCinema(undefined);
    setSelectedShowtime(undefined);
  }, [selectedCity]);

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


            {/* Chọn thành phố - chỉ hiển thị khi đã chọn ngày */}
            {selectedDate && (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-base sm:text-lg font-semibold">Chọn thành phố</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                  {citiesLoading ? (
                    <div className="col-span-full text-center py-4 text-muted-foreground">
                      Đang tải thành phố...
                    </div>
                  ) : cities && cities.length > 0 ? (
                    cities.map((city) => (
                      <Button
                        key={city}
                        type="button"
                        variant={selectedCity === city ? "default" : "outline"}
                        className={`p-3 h-auto text-left justify-center transition-all duration-200 ${selectedCity === city
                          ? "ring-1 sm:ring-2 ring-primary shadow-md"
                          : "hover:shadow-sm"
                          }`}
                        onClick={() => setSelectedCity(city)}
                      >
                        <div className="font-medium text-sm sm:text-base">{city}</div>
                      </Button>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-4 text-muted-foreground">
                      Không có thành phố nào
                    </div>
                  )}
                </div>
              </div>
            )}
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
            {/* Chọn rạp - chỉ hiển thị khi đã chọn thành phố */}
            {selectedDate && selectedCity && (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-base sm:text-lg font-semibold">Chọn rạp chiếu</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                  {theatersLoading ? (
                    <div className="col-span-full text-center py-4 text-muted-foreground">
                      Đang tải rạp chiếu...
                    </div>
                  ) : theatersInSelectedCity && theatersInSelectedCity.length > 0 ? (
                    theatersInSelectedCity.map((theater) => (
                      <Button
                        key={theater.theater_id}
                        type="button"
                        variant={selectedCinema?.theater_id === theater.theater_id ? "default" : "outline"}
                        className={`p-3 h-auto text-left justify-start transition-all duration-200 ${selectedCinema?.theater_id === theater.theater_id
                          ? "ring-1 sm:ring-2 ring-primary shadow-md"
                          : "hover:shadow-sm"
                          }`}
                        onClick={() => setSelectedCinema(theater)}
                      >
                        <div className="flex flex-col items-start">
                          <div className="font-semibold text-sm sm:text-base">{theater.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2 mt-1 overflow-hidden text-ellipsis">
                            {theater.address}
                          </div>
                        </div>
                      </Button>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-4 text-muted-foreground">
                      Không có rạp chiếu nào trong thành phố này
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Chọn suất chiếu - chỉ hiển thị khi đã chọn ngày và rạp */}
            {selectedDate && selectedCity && (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <h3 className="text-base sm:text-lg font-semibold">Chọn suất chiếu</h3>
                </div>

                {selectedCinema ? (
                  showtimesLoading ? (
                    <div className="text-center py-4 text-muted-foreground">
                      Đang tải suất chiếu...
                    </div>
                  ) : availableShowtimes.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                      {availableShowtimes.map((showtime) => {
                        const showTime = format(new Date(showtime.show_datetime), 'HH:mm');
                        return (
                          <Button
                            key={showtime.showtime_id}
                            type="button"
                            variant={
                              selectedShowtime?.showtime_id === showtime.showtime_id
                                ? "default"
                                : "outline"
                            }
                            className={`flex flex-col items-center justify-center p-2 sm:p-4 h-auto space-y-1 sm:space-y-2 transition-all duration-200 ${selectedShowtime?.showtime_id === showtime.showtime_id
                                ? "ring-1 sm:ring-2 ring-primary shadow-md sm:shadow-lg"
                                : "hover:shadow-sm sm:hover:shadow-md"
                              }`}
                            onClick={() => setSelectedShowtime(showtime)}
                          >
                            <div className="text-base sm:text-lg font-bold">{showTime}</div>
                            <div className="text-xs text-muted-foreground">{showtime.format}</div>
                            <div className="text-xs text-green-600 font-medium">
                              {showtime.ticket_price.toLocaleString('vi-VN')} đ
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8 text-muted-foreground">
                      <Clock className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm sm:text-base">Không có suất chiếu nào cho ngày này</p>
                    </div>
                  )
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

          <CardFooter className="p-3 sm:p-4 pt-0 items-center flex">
            <Button
              type="button"
              size="lg"
              className="w-full h-10 sm:h-12 text-sm sm:text-base font-semibold"
              disabled={!selectedCity || !selectedCinema || !selectedDate || !selectedShowtime || showtimesLoading}
              onClick={() => {
                if (selectedShowtime && selectedCinema && movieData && selectedDate) {
                  // Lưu thông tin booking vào Redux store + sessionStorage
                  dispatch(setBookingData({
                    movieId: movieData.movie_id,
                    movieTitle: movieData.title,
                    theaterId: selectedCinema.theater_id,
                    theaterName: selectedCinema.name,
                    theaterAddress: selectedCinema.address,
                    showDate: selectedDate,
                    showTime: format(new Date(selectedShowtime.show_datetime), 'HH:mm'),
                    format: selectedShowtime.format,
                    ticketPrice: selectedShowtime.ticket_price,
                    roomId: selectedShowtime.room_id,
                    showtimeId: selectedShowtime.showtime_id
                  }));
                  
                  // Navigate to booking page
                  router.push('/booking');
                }
              }}
            >
              {showtimesLoading
                ? "Đang tải suất chiếu..."
                : selectedCity && selectedCinema && selectedDate && selectedShowtime
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