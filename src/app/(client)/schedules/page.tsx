"use client"
import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Film, Clock, Info, MapPin, Star, Users } from "lucide-react";
import { format, addDays, isToday, isTomorrow } from "date-fns";
import { vi } from "date-fns/locale";

// Mock data phim và rạp - Dữ liệu chuyên nghiệp hơn
const movie = {
  title: "Spider-Man: No Way Home",
  poster: "https://image.tmdb.org/t/p/w500/uJYYizSuA9Y3DCs0qS4qWvHfZg4.jpg",
  genre: "Hành động, Phiêu lưu, Khoa học viễn tưởng",
  duration: 148,
  format: ["2D", "3D", "IMAX"],
  age: "C13",
  rating: 8.4,
  description: "Peter Parker phải đối mặt với những thử thách lớn nhất khi danh tính Spider-Man của anh bị tiết lộ. Khi anh cầu cứu Doctor Strange, họ vô tình mở ra một thế giới song song đầy nguy hiểm.",
  director: "Jon Watts",
  cast: ["Tom Holland", "Zendaya", "Benedict Cumberbatch"],
};

const cinema = {
  name: "CGV Vincom Center Landmark 81",
  address: "Tầng B1-B2, Vincom Center Landmark 81, 720A Điện Biên Phủ, Bình Thạnh, TP.HCM",
  phone: "1900 6017",
  facilities: ["IMAX", "4DX", "Screenx", "Premium"],
};

// Tạo lịch chiếu động từ ngày hiện tại
const generateShowTimes = () => {
  const today = new Date();
  const showTimes: Record<string, { time: string; format: string; seats: number }[]> = {};
  
  for (let i = 0; i < 7; i++) {
    const date = addDays(today, i);
    const dateKey = format(date, 'yyyy-MM-dd');
    
    showTimes[dateKey] = [
      { time: "09:00", format: "2D", seats: 45 },
      { time: "11:30", format: "3D", seats: 23 },
      { time: "14:15", format: "2D", seats: 67 },
      { time: "16:45", format: "IMAX", seats: 12 },
      { time: "19:30", format: "3D", seats: 89 },
      { time: "22:00", format: "2D", seats: 156 },
    ];
  }
  
  return showTimes;
};

export default function SchedulesPage() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [selectedShowtime, setSelectedShowtime] = useState<{ time: string; format: string; seats: number } | undefined>();

  const showTimes = useMemo(() => generateShowTimes(), []);
  
  // Tự động chọn ngày hôm nay làm mặc định
  const today = format(new Date(), 'yyyy-MM-dd');
  const [currentDate] = useState(today);
  
  React.useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(today);
    }
  }, [selectedDate, today]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && selectedShowtime) {
      // Redirect to booking page with selected data
      const bookingData = {
        movie: movie.title,
        cinema: cinema.name,
        date: selectedDate,
        time: selectedShowtime.time,
        format: selectedShowtime.format,
      };
      console.log('Booking data:', bookingData);
      alert(`Chọn suất chiếu thành công!\nPhim: ${movie.title}\nNgày: ${format(new Date(selectedDate), 'dd/MM/yyyy', { locale: vi })}\nGiờ: ${selectedShowtime.time}\nĐịnh dạng: ${selectedShowtime.format}\n\nTiếp theo: Chọn ghế ngồi`);
    }
  };

  // Tạo danh sách 7 ngày từ hôm nay
  const availableDates = useMemo(() => {
    return Object.keys(showTimes).map((date) => {
      const d = new Date(date);
      let label = format(d, "EEEE", { locale: vi });
      
      // Thêm nhãn đặc biệt cho hôm nay và ngày mai
      if (isToday(d)) {
        label = "Hôm nay";
      } else if (isTomorrow(d)) {
        label = "Ngày mai";
      }
      
      return {
        date,
        label,
        day: format(d, "dd"),
        month: format(d, "MM"),
        year: format(d, "yyyy"),
        isToday: isToday(d),
        isTomorrow: isTomorrow(d),
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [showTimes]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-6 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}


        <Card className="shadow-2xl border-0 overflow-hidden">
          {/* Movie Info Header */}
          <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                  <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Lịch Chiếu Phim</h1>
          <p className="text-muted-foreground">Chọn suất chiếu phù hợp với bạn</p>
        </div>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="relative">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  width={160}
                  height={240}
                  className="w-32 h-48 lg:w-40 lg:h-60 object-cover rounded-xl shadow-lg mx-auto lg:mx-0"
                />
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white font-bold">
                  {movie.age}
                </Badge>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <CardTitle className="text-xl lg:text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <Film className="w-6 h-6 text-primary" />
                    {movie.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-semibold text-yellow-600">{movie.rating}</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <Badge variant="outline" className="text-xs">
                      Đạo diễn: {movie.director}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Thể loại:</span>
                      <span className="font-medium">{movie.genre}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Thời lượng:</span>
                      <span className="font-medium">{movie.duration} phút</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Diễn viên:</span>
                      <span className="font-medium text-xs">{movie.cast.join(", ")}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-semibold text-sm">{cinema.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">{cinema.address}</div>
                        <div className="text-xs text-primary font-medium mt-1">Hotline: {cinema.phone}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {movie.description}
                  </p>
                </div>

                <div className="flex gap-2">
                  {movie.format.map((format) => (
                    <Badge key={format} variant="secondary" className="text-xs">
                      {format}
                    </Badge>
                  ))}
                  {cinema.facilities.map((facility) => (
                    <Badge key={facility} variant="outline" className="text-xs">
                      {facility}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-8 p-6">
              {/* Chọn ngày */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Chọn ngày chiếu</h3>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
                  {availableDates.map(({ date, label, day, month, year, isToday, isTomorrow }) => (
                    <Button
                      key={date}
                      type="button"
                      variant={selectedDate === date ? "default" : "outline"}
                      className={`flex flex-col mt-2 ml-2 items-center justify-center min-w-[80px] h-20 rounded-xl whitespace-nowrap transition-all duration-200 ${
                        selectedDate === date 
                          ? "ring-2 ring-primary shadow-lg scale-105" 
                          : "hover:shadow-md hover:scale-102"
                      } ${isToday ? "border-primary" : ""}`}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedShowtime(undefined);
                      }}
                    >
                      <span className={`text-xs font-medium mb-1 capitalize ${
                        isToday ? "text-primary" : "text-muted-foreground"
                      }`}>
                        {label}
                      </span>
                      <span className="text-xl font-bold leading-none">{day}</span>
                      <span className="text-xs text-muted-foreground">{month}/{year}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Chọn suất chiếu */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Chọn suất chiếu</h3>
                </div>
                
                {selectedDate ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {showTimes[selectedDate]?.map((showtime) => (
                      <Button
                        key={`${showtime.time}-${showtime.format}`}
                        type="button"
                        variant={
                          selectedShowtime?.time === showtime.time && selectedShowtime?.format === showtime.format
                            ? "default" 
                            : "outline"
                        }
                        className={`flex flex-col items-center justify-center p-4 h-auto space-y-2 transition-all duration-200 ${
                          selectedShowtime?.time === showtime.time && selectedShowtime?.format === showtime.format
                            ? "ring-2 ring-primary shadow-lg" 
                            : "hover:shadow-md"
                        }`}
                        onClick={() => setSelectedShowtime(showtime)}
                      >
                        <div className="text-lg font-bold">{showtime.time}</div>
                        <div className="flex gap-2 items-center">
                          <Badge variant="secondary" className="text-xs">
                            {showtime.format}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {showtime.seats} ghế trống
                          </Badge>
                        </div>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Vui lòng chọn ngày để xem suất chiếu</p>
                  </div>
                )}
              </div>

              {/* Tóm tắt lựa chọn */}
              {(selectedDate || selectedShowtime) && (
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4 space-y-3 border border-primary/20">
                  <h4 className="font-semibold text-primary mb-3">Thông tin đặt vé</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phim:</span>
                        <span className="font-medium">{movie.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rạp:</span>
                        <span className="font-medium">{cinema.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ngày:</span>
                        <span className="font-medium">
                          {selectedDate 
                            ? format(new Date(selectedDate), 'EEEE, dd/MM/yyyy', { locale: vi })
                            : <span className="text-muted-foreground">Chưa chọn</span>
                          }
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Giờ:</span>
                        <span className="font-medium">
                          {selectedShowtime?.time || <span className="text-muted-foreground">Chưa chọn</span>}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Định dạng:</span>
                        <span className="font-medium">
                          {selectedShowtime?.format || <span className="text-muted-foreground">Chưa chọn</span>}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ghế còn trống:</span>
                        <span className="font-medium">
                          {selectedShowtime?.seats 
                            ? `${selectedShowtime.seats} ghế`
                            : <span className="text-muted-foreground">Chưa chọn</span>
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="p-6 pt-0">
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-semibold"
                disabled={!selectedDate || !selectedShowtime}
              >
                {selectedDate && selectedShowtime 
                  ? "Tiếp tục chọn ghế"
                  : "Vui lòng chọn suất chiếu"
                }
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}