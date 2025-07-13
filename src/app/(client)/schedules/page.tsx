"use client"
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Film, Clock, Info, MapPin } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Mock data phim và rạp
const movie = {
  title: "Avengers: Endgame",
  poster: "/public/images/avengers.jpg", // Đổi thành ảnh thật nếu có
  genre: "Hành động, Phiêu lưu",
  duration: 181,
  format: "2D",
  age: "C13",
  description: "Sau cú búng tay của Thanos, các siêu anh hùng còn lại cùng nhau chiến đấu để cứu vũ trụ.",
};
const cinema = {
  name: "CGV Aeon Mall",
  address: "Số 1 Đường ABC, Quận 1, TP.HCM",
};

const showTimes = {
  "2024-06-01": ["10:00", "13:00", "16:00", "19:00"],
  "2024-06-02": ["11:00", "14:00", "17:00", "20:00"],
  "2024-06-03": ["09:00", "12:00", "15:00", "18:00"],
  "2024-06-04": ["10:30", "13:30", "16:30", "19:30"],
};

export default function SchedulesPage() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [combo, setCombo] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Ngày: ${selectedDate || "-"}\nGiờ: ${selectedTime || "-"}\nCombo: ${combo ? "Có" : "Không"}`
    );
  };

  // Tạo danh sách 10 ngày liên tiếp từ hôm nay
  const availableDates = Object.keys(showTimes).map((date) => {
    const d = new Date(date);
    return {
      date,
      label: format(d, "EEEE", { locale: vi }),
      day: format(d, "dd"),
      month: format(d, "MM"),
      year: format(d, "yyyy"),
    };
  });

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-background">
      <Card className="w-full max-w-xs sm:max-w-md md:max-w-2xl shadow-xl my-4">
        {/* Thông tin phim và rạp */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 border-b">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-24 h-36 sm:w-28 sm:h-40 object-cover rounded-lg border shadow-md mx-auto md:mx-0"
            onError={(e) => (e.currentTarget.src = '/public/images/avengers.jpg')}
          />
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Film className="w-5 h-5 text-primary" />
              <span className="text-lg sm:text-xl font-bold line-clamp-2">{movie.title}</span>
              <Badge variant="destructive" className="ml-2">{movie.age}</Badge>
            </div>
            <div className="flex flex-wrap gap-2 items-center text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Info className="w-4 h-4" /> {movie.genre}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {movie.duration} phút</span>
              <span className="flex items-center gap-1"><Badge variant="secondary">{movie.format}</Badge></span>
            </div>
            <div className="text-xs sm:text-sm mt-2 text-foreground/80 line-clamp-2 sm:line-clamp-3">{movie.description}</div>
            <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm flex-wrap">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold">{cinema.name}</span>
              <span className="text-xs text-muted-foreground">{cinema.address}</span>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-2">
            {/* Chọn ngày */}
            <div>
              <label className="block font-semibold mb-2">Chọn ngày:</label>
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
                {availableDates.map(({ date, label, day, month, year }) => (
                  <Button
                    key={date}
                    type="button"
                    variant={selectedDate === date ? "default" : "outline"}
                    className={`flex flex-col items-center min-w-[70px] sm:min-w-[90px] min-h-[70px] sm:min-h-[80px] px-2 sm:px-3 py-2 rounded-xl shadow-md border-2 transition-all duration-150 text-xs sm:text-base ${selectedDate === date ? "ring-2 ring-primary bg-primary/10 text-primary" : "hover:bg-muted"}`}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedTime(undefined);
                    }}
                  >
                    <span className="flex items-center gap-1 text-xs font-semibold mb-1 capitalize">
                      <Calendar className="w-4 h-4 mr-1 text-primary" />{label}
                    </span>
                    <span className="text-xl sm:text-2xl font-bold leading-none">{day}</span>
                    <span className="text-xs text-muted-foreground">{month}/{year}</span>
                  </Button>
                ))}
              </div>
            </div>
            {/* Chọn giờ */}
            <div>
              <label className="block font-semibold mb-2">Chọn giờ:</label>
              <div className="grid grid-cols-2 gap-3">
                {selectedDate && (showTimes[selectedDate as keyof typeof showTimes] || []).length === 0 && (
                  <div className="col-span-2 text-center text-muted-foreground">Không có suất chiếu</div>
                )}
                {(selectedDate ? showTimes[selectedDate as keyof typeof showTimes] || [] : []).map((time) => (
                  <Button
                    key={time}
                    type="button"
                    variant={selectedTime === time ? "default" : "outline"}
                    className={`py-3 ${selectedTime === time ? "ring-2 ring-green-500" : ""}`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
            {/* Phần bổ sung */}
            <div className="flex items-center gap-2">
              <Input
                id="combo"
                type="checkbox"
                checked={combo}
                onChange={(e) => setCombo(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="combo" className="text-sm select-none cursor-pointer">
                Thêm combo bắp nước
              </label>
              {combo && <Badge variant="secondary">Đã chọn combo</Badge>}
            </div>
            {/* Tổng kết lựa chọn */}
            <div className="bg-muted rounded-lg p-3 text-sm space-y-1">
              <div>Ngày: <b>{selectedDate ? selectedDate : <span className="text-muted-foreground">Chưa chọn</span>}</b></div>
              <div>Giờ: <b>{selectedTime ? selectedTime : <span className="text-muted-foreground">Chưa chọn</span>}</b></div>
              <div>Combo: <b>{combo ? "Có" : "Không"}</b></div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={!selectedDate || !selectedTime}
            >
              Xác nhận
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}