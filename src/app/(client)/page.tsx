"use client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Movie, transformMovieFromAPI } from "@/data/movies";
import { Button } from "@/components/ui/button";
import { MovieSlider } from "@/components/MovieSlider";
import { useGetAllMoviesQuery } from "@/store/slices/movies/moviesApi";
import { Skeleton } from "@/components/ui/skeleton";

// Loading component cho movie cards
function MovieCardSkeleton() {
  return (
    <Card className="w-64 border-border shadow-xl relative overflow-hidden bg-card">
      <Skeleton className="w-full h-80" />
      <div className="mt-4 px-2 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex justify-center gap-2 mt-4 mb-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>
    </Card>
  );
}

function MovieSliderSkeleton() {
  return (
    <div className="bg-background relative flex items-center justify-center">
      <div className="w-full max-w-6xl flex gap-8 justify-center">
        {Array.from({ length: 4 }).map((_, idx) => (
          <MovieCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
}

// Fallback banners nếu không có dữ liệu từ API
const fallbackBanners = [
  {
    image: "/dino-banner.jpg",
    title: "Thế giới khủng long",
    subtitle: "Tái sinh",
    release: "04.07.2025",
    cta: "ĐẶT VÉ NGAY",
    href: "/booking/1",
  },
  {
    image: "/globe.svg",
    title: "Hành tinh bí ẩn",
    subtitle: "Cuộc phiêu lưu mới",
    release: "12.08.2025",
    cta: "ĐẶT VÉ NGAY",
    href: "/booking/2",
  },
];

function HeroBannerSlider() {
  const [current, setCurrent] = useState(0);
  const [prevIdx, setPrevIdx] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Lấy dữ liệu phim nổi bật từ API
  const { data: featuredMoviesData, isLoading } = useGetAllMoviesQuery({ 
    limit: 5, 
    status: 'now_showing' 
  });

  // Tạo banners từ dữ liệu API hoặc sử dụng fallback
  const banners = featuredMoviesData?.items?.length 
    ? featuredMoviesData.items.map((movie, index) => ({
        image: movie.poster_url || fallbackBanners[index % fallbackBanners.length].image,
        title: movie.title,
        subtitle: movie.director || "Đạo diễn",
        release: movie.release_date ? new Date(movie.release_date).toLocaleDateString('vi-VN') : "Sắp ra mắt",
        cta: "ĐẶT VÉ NGAY",
        href: `/movie/${movie.movie_id}`,
      }))
    : fallbackBanners;
    
  const total = banners.length;

  // Auto-play
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDirection('right');
      setPrevIdx(current);
      setCurrent((prev) => (prev + 1) % total);
    }, 5000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, total]);

  const goTo = (idx: number) => {
    setDirection(idx > current ? 'right' : 'left');
    setPrevIdx(current);
    setCurrent(idx);
  };
  const prev = () => {
    setDirection('left');
    setPrevIdx(current);
    setCurrent((prev) => (prev - 1 + total) % total);
  };
  const next = () => {
    setDirection('right');
    setPrevIdx(current);
    setCurrent((prev) => (prev + 1) % total);
  };

  // Animation logic
  const banner = banners[current];
  const prevBanner = banners[prevIdx];
  const isChanging = current !== prevIdx;

  if (isLoading) {
    return (
      <div className="w-full flex justify-center mb-8">
        <div className="relative w-full max-w-6xl aspect-[3.5/1] rounded-xl overflow-hidden shadow-2xl bg-muted">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center mb-8">
      <div className="relative w-full max-w-6xl aspect-[3.5/1] rounded-xl overflow-hidden shadow-2xl bg-muted">
        {/* Banner mới */}
        <div
          key={current}
          className={`absolute inset-0 transition-all duration-700 ease-in-out
            ${isChanging ?
              direction === 'right'
                ? 'translate-x-0 opacity-100 z-20'
                : 'translate-x-0 opacity-100 z-20'
              : 'translate-x-0 opacity-100 z-20'}
          `}
          style={{ pointerEvents: isChanging ? 'none' : 'auto' }}
        >
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            className="object-cover transition-all duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent transition-all duration-700" />
          <div className="absolute inset-0 flex flex-col justify-center pl-12 pr-8 py-8 gap-4">
            <div className="flex flex-col gap-2 max-w-[60%]">
              <div className="text-4xl md:text-5xl font-extrabold drop-shadow-lg text-white uppercase tracking-wider">
                {banner.title} <span className="block text-2xl md:text-3xl font-bold text-yellow-400">{banner.subtitle}</span>
              </div>
              <div className="mt-2 text-lg md:text-2xl font-semibold text-white drop-shadow">
                Khởi chiếu tại rạp <span className="text-yellow-300 font-bold">{banner.release}</span>
              </div>
            </div>
            <div className="mt-6">
              <Button
                asChild
                variant="default"
                size="lg"
                className="bg-yellow-400 text-black font-extrabold text-lg px-10 py-3 rounded-md shadow-lg hover:bg-yellow-300 transition-all duration-200"
              >
                <Link href={banner.href}>{banner.cta}</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Banner cũ (hiệu ứng slide out) */}
        {isChanging && (
          <div
            key={prevIdx}
            className={`absolute inset-0 transition-all duration-700 ease-in-out z-10
              ${direction === 'right' ? '-translate-x-1/3 opacity-0' : 'translate-x-1/3 opacity-0'}
            `}
          >
            <Image
              src={prevBanner.image}
              alt={prevBanner.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center pl-12 pr-8 py-8 gap-4">
              <div className="flex flex-col gap-2 max-w-[60%]">
                <div className="text-4xl md:text-5xl font-extrabold drop-shadow-lg text-white uppercase tracking-wider">
                  {prevBanner.title} <span className="block text-2xl md:text-3xl font-bold text-yellow-400">{prevBanner.subtitle}</span>
                </div>
                <div className="mt-2 text-lg md:text-2xl font-semibold text-white drop-shadow">
                  Khởi chiếu tại rạp <span className="text-yellow-300 font-bold">{prevBanner.release}</span>
                </div>
              </div>
              <div className="mt-6">
                <Button
                  asChild
                  variant="default"
                  size="lg"
                  className="bg-yellow-400 text-black font-extrabold text-lg px-10 py-3 rounded-md shadow-lg hover:bg-yellow-300 transition-all duration-200"
                >
                  <Link href={prevBanner.href}>{prevBanner.cta}</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Nút chuyển trái/phải */}
        <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200 z-30">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200 z-30">
          <ArrowRight className="w-6 h-6" />
        </button>
        {/* Dot indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-200 ${current === idx ? "bg-yellow-400 scale-125 shadow-lg" : "bg-white/30"}`}
              aria-label={`Chuyển đến banner ${idx + 1}`}
            />
          ))}
        </div>
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
    <div className="flex items-center gap-4 bg-muted px-8 py-3 rounded-lg shadow-lg max-w-6xl w-full mx-auto border border-border">
      <span className="font-extrabold text-xl text-foreground mr-4 whitespace-nowrap">
        ĐẶT VÉ NHANH
      </span>
      <select
        className={`font-bold text-base px-4 py-2 rounded border-2 min-w-[150px] h-12 bg-background border-border text-foreground focus:ring-2 focus:ring-ring transition-all duration-200 ${selected.cinema ? "text-yellow-500 border-yellow-400" : ""}`}
        value={selected.cinema}
        onChange={(e) => handleSelect("cinema", e.target.value)}
      >
        <option value="">1. Chọn Rạp</option>
        <option value="cgv">CGV</option>
        <option value="bhd">BHD</option>
      </select>
      <select
        ref={movieRef}
        className={`font-bold text-base px-4 py-2 rounded border-2 min-w-[170px] h-12 bg-background border-border text-foreground focus:ring-2 focus:ring-ring transition-all duration-200 ${selected.movie ? "text-yellow-500 border-yellow-400" : ""}`}
        value={selected.movie}
        onChange={(e) => handleSelect("movie", e.target.value)}
      >
        <option value="">2. Chọn Phim</option>
        <option value="nvbkt">Nhiệm Vụ Bất Khả Thi</option>
        <option value="kungfu">Kungfu Panda 4</option>
      </select>
      <select
        ref={dateRef}
        className={`font-bold text-base px-4 py-2 rounded border-2 min-w-[140px] h-12 bg-background border-border text-foreground focus:ring-2 focus:ring-ring transition-all duration-200 ${selected.date ? "text-yellow-500 border-yellow-400" : ""}`}
        value={selected.date}
        onChange={(e) => handleSelect("date", e.target.value)}
      >
        <option value="">3. Chọn Ngày</option>
        <option value="2024-06-01">01/06/2024</option>
        <option value="2024-06-02">02/06/2024</option>
      </select>
      <select
        ref={timeRef}
        className={`font-bold text-base px-4 py-2 rounded border-2 min-w-[120px] h-12 bg-background border-border text-foreground focus:ring-2 focus:ring-ring transition-all duration-200 ${selected.time ? "text-yellow-500 border-yellow-400" : ""}`}
        value={selected.time}
        onChange={(e) => handleSelect("time", e.target.value)}
      >
        <option value="">4. Chọn Suất</option>
        <option value="10:00">10:00</option>
        <option value="14:00">14:00</option>
      </select>
      <Button variant="default" size="lg" className="min-w-[110px] h-12">
        ĐẶT NGAY
      </Button>
    </div>
  );
}

export default function ClientHome() {
  // Lấy dữ liệu phim từ API
  const { 
    data: showingMoviesData, 
    isLoading: isLoadingShowing, 
    error: errorShowing 
  } = useGetAllMoviesQuery({ 
    limit: 20, 
    status: 'now_showing' 
  });

  const { 
    data: upcomingMoviesData, 
    isLoading: isLoadingUpcoming, 
    error: errorUpcoming 
  } = useGetAllMoviesQuery({ 
    limit: 20, 
    status: 'upcoming' 
  });

  // Chuyển đổi dữ liệu từ API sang format hiện tại
  const showingMovies = showingMoviesData?.items?.map(transformMovieFromAPI) || [];
  const upcomingMovies = upcomingMoviesData?.items?.map(transformMovieFromAPI) || [];

  return (
    <div className="bg-background text-foreground min-h-screen p-4 transition-colors duration-300">
      {/* Banner lớn */}
      <HeroBannerSlider />
      
      {/* Đặt vé nhanh */}
      <div className="flex flex-col items-center gap-2">
        <QuickBooking />
      </div>
      
      {/* Phim đang chiếu - Slider */}
      <div className="mt-8">
        <h2 className="text-center text-3xl font-extrabold mb-8 tracking-wider text-foreground">
          PHIM ĐANG CHIẾU
        </h2>
        {isLoadingShowing ? (
          <MovieSliderSkeleton />
        ) : errorShowing ? (
          <div className="text-center py-8">
            <p className="text-red-500">Có lỗi khi tải dữ liệu phim đang chiếu</p>
          </div>
        ) : (
          <MovieSlider movies={showingMovies} />
        )}
        {/* Xem thêm */}
        <div className="flex justify-center mt-12">
          <Button asChild variant="default" size="lg" className="bg-yellow-400 text-black font-bold hover:bg-yellow-300">
            <Link href="/showing">XEM THÊM</Link>
          </Button>
        </div>
      </div>
      
      {/* Phim sắp chiếu - Slider */}
      <div className="mt-16">
        <h2 className="text-center text-3xl font-extrabold mb-8 tracking-wider text-foreground">
          PHIM SẮP CHIẾU
        </h2>
        {isLoadingUpcoming ? (
          <MovieSliderSkeleton />
        ) : errorUpcoming ? (
          <div className="text-center py-8">
            <p className="text-red-500">Có lỗi khi tải dữ liệu phim sắp chiếu</p>
          </div>
        ) : (
          <MovieSlider movies={upcomingMovies} />
        )}
        <div className="flex justify-center mt-12">
          <Button asChild variant="default" size="lg" className="bg-yellow-400 text-black font-bold hover:bg-yellow-300">
            <Link href="/upcoming">XEM THÊM</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
