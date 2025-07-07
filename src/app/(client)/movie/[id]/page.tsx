"use client";

import React from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const mockMovie = {
  id: "1",
  title: "Thanh Gươm Diệt Quỷ: Phép Màu Từ Hơi Thở",
  description:
    "Một phần mới trong vũ trụ Kimetsu no Yaiba, nơi các kiếm sĩ diệt quỷ phải đối mặt với những thử thách chết người.",
  poster: "/images/kimetsu-official-poster.jpg",
  banner: "/images/kimetsu-banner.jpg",
  trailerUrl: "https://www.youtube.com/embed/_3Bq1DKfRYs",
  releaseDate: "2025-07-12",
  genre: ["Hành động", "Kịch tính", "Anime"],
  format: "2D",
  language: "Tiếng Nhật",
  subtitle: "Tiếng Việt",
  duration: "115 phút",
  rating: "C13",
  director: "Haruo Sotozaki",
  actors: ["Natsuki Hanae", "Akari Kitō", "Hiro Shimono"],
  country: "Nhật Bản",
  ticketPrice: "90.000đ – 120.000đ",
  showtimes: [
    {
      theater: "Cinestar Quốc Thanh",
      date: "2025-07-08",
      times: ["13:30", "15:45", "18:00"]
    },
    {
      theater: "Cinestar Huỳnh Thúc Kháng",
      date: "2025-07-08",
      times: ["12:00", "14:15", "17:30"]
    }
  ]
};

export default function MovieDetailPage() {
  const movie = mockMovie;

  return (
    <div className="bg-black text-white min-h-screen pb-24">
      {/* Banner section */}
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden">
        <Image
          src={movie.banner}
          alt="banner"
          layout="fill"
          objectFit="cover"
          className="opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        <div className="absolute bottom-6 left-6 md:left-16 flex items-center gap-6">
          <Image
            src={movie.poster}
            alt="poster"
            width={160}
            height={240}
            className="rounded-xl shadow-xl"
          />
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-red-600 mb-2">
              {movie.title}
            </h1>
            <p className="text-sm md:text-base text-gray-300">
              {movie.duration} • {movie.genre.join(", ")} • {movie.format} • {movie.language} ({movie.subtitle})
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Khởi chiếu: {movie.releaseDate} • Đánh giá: {movie.rating}
            </p>
            <p className="text-sm text-gray-400 mt-1">Đạo diễn: {movie.director}</p>
            <p className="text-sm text-gray-400 mt-1">Diễn viên: {movie.actors.join(", ")}</p>
            <p className="text-sm text-gray-400 mt-1">Quốc gia: {movie.country}</p>
            <p className="text-sm text-gray-400 mt-1">Giá vé: {movie.ticketPrice}</p>
          </div>
        </div>
      </div>

      {/* Tabs section */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <Tabs defaultValue="trailer">
          <TabsList className="bg-gray-900 rounded-md mb-6">
            <TabsTrigger value="trailer">🎬 Trailer</TabsTrigger>
            <TabsTrigger value="description">📄 Mô tả</TabsTrigger>
            <TabsTrigger value="schedule">🗓 Lịch chiếu</TabsTrigger>
            <TabsTrigger value="comments">💬 Bình luận</TabsTrigger>
          </TabsList>

          <TabsContent value="trailer">
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe
                className="w-full h-full"
                src={movie.trailerUrl}
                title="Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </TabsContent>

          <TabsContent value="description">
            <p className="text-base text-gray-300 leading-relaxed">
              {movie.description}
            </p>
          </TabsContent>

          <TabsContent value="schedule">
            <div className="space-y-6">
              {movie.showtimes.map((st) => (
                <div key={st.theater} className="bg-gray-800 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-red-500 mb-2">{st.theater}</h4>
                  <p className="text-sm text-gray-400 mb-2">Ngày: {st.date}</p>
                  <div className="flex flex-wrap gap-2">
                    {st.times.map((time) => (
                      <button
                        key={time}
                        className="inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs h-8 rounded-md gap-1.5 has-[>svg]:px-2.5 text-red-800 bg-amber-400 hover:bg-amber-300 font-medium text-xs sm:text-sm px-2 sm:px-3"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="comments">
            <p className="italic text-muted-foreground text-sm">
              Chức năng bình luận sẽ được cập nhật sớm.
            </p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Nút đặt vé cố định */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs h-8 rounded-md gap-1.5 has-[>svg]:px-2.5 text-red-800 bg-amber-400 hover:bg-amber-300 font-medium text-xs sm:text-sm px-2 sm:px-3"
        >
          <span className="hidden sm:inline">Đặt vé ngay</span>
          <span className="sm:hidden">Đặt vé</span>
        </button>
      </div>
    </div>
  );
}