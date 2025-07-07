"use client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState, useRef } from "react";
import Link from "next/link";
import { BadgeCheck, Clock, Globe, MessageSquareText } from "lucide-react";
import { movies, Movie } from "@/data/movies";

const comingMovies = movies.filter((movie: Movie) => movie.status === "upcoming");

function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

function MovieSlider({ movies }: { movies: Movie[] }) {
  const movieGroups = chunkArray<Movie>(movies, 4);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    slides: { origin: 'auto', perView: 1 },
    loop: true,
  });

  return (
    <div className="relative flex items-center justify-center">
      <button
        className="z-10 bg-white/20 hover:bg-white/40 text-white rounded-full w-10 h-10 flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2"
        onClick={() => instanceRef.current?.prev()}
        aria-label="Trước"
      >
        &#8592;
      </button>
      <div ref={sliderRef} className="keen-slider w-full max-w-6xl">
        {movieGroups.map((group, idx) => (
          <div className="keen-slider__slide flex gap-8 justify-center" key={idx}>
            {group.map((movie: Movie) => (
              <Card key={movie.id} className="w-64 bg-[#181f3a] border-none shadow-xl relative group overflow-hidden">
                {/* Badge tuổi */}
                <div className={`absolute top-2 left-2 flex items-center gap-1 z-10`}>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${movie.badgeColor}`}>{movie.badge}</span>
                  <span className="bg-black/80 text-xs px-1 rounded">{movie.age > 0 ? movie.age+"+" : "K"}</span>
                </div>
                {/* Poster */}
                <div className="w-full h-80 relative rounded-lg overflow-hidden">
                  <Image src={movie.poster} alt={movie.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-start p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 text-white">
                    <div className="font-bold text-lg mb-4 leading-snug">{movie.title}</div>
                    <div className="flex items-center gap-2 mb-2 text-sm">
                      <BadgeCheck className="w-4 h-4 text-yellow-400" /> {movie.genre}
                    </div>
                    <div className="flex items-center gap-2 mb-2 text-sm">
                      <Clock className="w-4 h-4 text-yellow-400" /> {movie.duration}
                    </div>
                    <div className="flex items-center gap-2 mb-2 text-sm">
                      <Globe className="w-4 h-4 text-yellow-400" /> {movie.country}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquareText className="w-4 h-4 text-yellow-400" /> {movie.subtitle}
                    </div>
                  </div>
                </div>
                {/* Tên phim */}
                <div className="mt-4 px-2 text-center font-bold text-base min-h-[48px] uppercase">{movie.title}</div>
                {/* Nút */}
                <div className="flex justify-center gap-2 mt-4 mb-2">
                  <button className="flex items-center gap-1 px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20 text-sm border border-white/20">
                    <span role="img" aria-label="trailer">🔴</span> Xem Trailer
                  </button>
                  <button className="bg-yellow-400 text-black font-bold px-4 py-1 rounded hover:bg-yellow-300 text-sm">ĐẶT VÉ</button>
                </div>
              </Card>
            ))}
          </div>
        ))}
      </div>
      <button
        className="z-10 bg-white/20 hover:bg-white/40 text-white rounded-full w-10 h-10 flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2"
        onClick={() => instanceRef.current?.next()}
        aria-label="Sau"
      >
        &#8594;
      </button>
      {/* Pagination dots */}
      <div className="flex justify-center mt-6 gap-2 absolute left-1/2 -translate-x-1/2 bottom-[-40px]">
        {movieGroups.map((_, idx) => (
          <span
            key={idx}
            className={`w-3 h-3 rounded-full ${currentSlide === idx ? 'bg-yellow-400' : 'bg-white/30'} inline-block`}
          ></span>
        ))}
      </div>
    </div>
  );
}

function QuickBooking() {
  const [selected, setSelected] = useState({
    cinema: "",
    movie: "",
    date: "",
    time: "",
  });
  const movieRef = useRef<HTMLSelectElement>(null);
  const dateRef = useRef<HTMLSelectElement>(null);
  const timeRef = useRef<HTMLSelectElement>(null);

  const handleSelect = (key: string, value: string) => {
    setSelected((prev) => ({ ...prev, [key]: value }));
    if (key === "cinema") movieRef.current?.focus();
    if (key === "movie") dateRef.current?.focus();
    if (key === "date") timeRef.current?.focus();
  };

  return (
    <div className="flex items-center gap-4 bg-[#f2f6ff] px-8 py-3 rounded-lg shadow-lg max-w-6xl w-full mx-auto">
      <span className="font-extrabold text-xl text-gray-800 mr-4 whitespace-nowrap">ĐẶT VÉ NHANH</span>
      <select
        className={`font-bold text-base px-4 py-2 rounded border-2 min-w-[150px] h-12 ${selected.cinema ? "text-yellow-500 border-yellow-400" : "text-purple-700 border-gray-300"}`}
        value={selected.cinema}
        onChange={(e) => handleSelect("cinema", e.target.value)}
      >
        <option value="">1. Chọn Rạp</option>
        <option value="cgv">CGV</option>
        <option value="bhd">BHD</option>
      </select>
      <select
        ref={movieRef}
        className={`font-bold text-base px-4 py-2 rounded border-2 min-w-[170px] h-12 ${selected.movie ? "text-yellow-500 border-yellow-400" : "text-purple-700 border-gray-300"}`}
        value={selected.movie}
        onChange={(e) => handleSelect("movie", e.target.value)}
      >
        <option value="">2. Chọn Phim</option>
        <option value="nvbkt">Nhiệm Vụ Bất Khả Thi</option>
        <option value="kungfu">Kungfu Panda 4</option>
      </select>
      <select
        ref={dateRef}
        className={`font-bold text-base px-4 py-2 rounded border-2 min-w-[140px] h-12 ${selected.date ? "text-yellow-500 border-yellow-400" : "text-purple-700 border-gray-300"}`}
        value={selected.date}
        onChange={(e) => handleSelect("date", e.target.value)}
      >
        <option value="">3. Chọn Ngày</option>
        <option value="2024-06-01">01/06/2024</option>
        <option value="2024-06-02">02/06/2024</option>
      </select>
      <select
        ref={timeRef}
        className={`font-bold text-base px-4 py-2 rounded border-2 min-w-[120px] h-12 ${selected.time ? "text-yellow-500 border-yellow-400" : "text-purple-700 border-gray-300"}`}
        value={selected.time}
        onChange={(e) => handleSelect("time", e.target.value)}
      >
        <option value="">4. Chọn Suất</option>
        <option value="10:00">10:00</option>
        <option value="14:00">14:00</option>
      </select>
      <button className="bg-purple-700 text-white font-extrabold text-base px-7 py-2 rounded hover:bg-purple-800 transition min-w-[110px] h-12">
        ĐẶT NGAY
      </button>
    </div>
  );
}

export default function ClientHome() {
  return (
    <div className="bg-gradient-to-b from-[#181f3a] to-[#2b2562] text-white min-h-screen p-4">
      {/* Đặt vé nhanh */}
      <div className="flex flex-col items-center gap-2">
        <QuickBooking />
      </div>

      {/* Phim đang chiếu - Slider */}
      <div className="mt-8">
        <h2 className="text-center text-3xl font-extrabold mb-8 tracking-wider">PHIM ĐANG CHIẾU</h2>
        <MovieSlider movies={movies} />
        {/* Xem thêm */}
        <div className="flex justify-center mt-12">
          <Link href="/showing">
            <button className="bg-yellow-400 text-black font-bold px-8 py-2 rounded hover:bg-yellow-300 text-lg">XEM THÊM</button>
          </Link>
        </div>
      </div>

      {/* Phim sắp chiếu - Slider */}
      <div className="mt-16">
        <h2 className="text-center text-3xl font-extrabold mb-8 tracking-wider">PHIM SẮP CHIẾU</h2>
        <MovieSlider movies={comingMovies} />
        <div className="flex justify-center mt-12">
          <Link href="/upcoming">
            <button className="bg-yellow-400 text-black font-bold px-8 py-2 rounded hover:bg-yellow-300 text-lg">XEM THÊM</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
