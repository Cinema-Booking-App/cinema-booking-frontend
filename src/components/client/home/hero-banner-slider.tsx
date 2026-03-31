"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, Calendar, User, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetListMoviesQuery } from "@/store/slices/movies/moviesApi";

export function HeroBannerSlider() {
  const [current, setCurrent] = useState(0);
  const [prevIdx, setPrevIdx] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { data: featuredMoviesData, isLoading } = useGetListMoviesQuery({ 
    limit: 5, 
    status: 'now_showing' 
  });

  const banners = featuredMoviesData?.items?.length
    ? featuredMoviesData.items.map((movie) => ({
        poster: movie.poster_url || "/placeholder.png",
        // backdrop: movie.backdrop_url || null,
        title: movie.title || "Phim chưa đặt tên",
        director: movie.director || "Đạo diễn chưa cập nhật",
        genre: movie.genre || "Chưa phân loại",
        duration: movie.duration ? `${movie.duration} phút` : "N/A",
        // rating: movie.rating || "N/A",
        release: movie.release_date
          ? new Date(movie.release_date).toLocaleDateString("vi-VN")
          : "Sắp ra mắt",
        description: movie.description || "Chưa có mô tả",
        href: `/movie/${movie.movie_id}`,
      }))
    : [];
    
  const total = banners.length;

  useEffect(() => {
    if (total === 0) return;
    if (current >= total) {
      setCurrent(0);
      setPrevIdx(0);
    }
  }, [total, current]);

  useEffect(() => {
    if (total <= 1) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDirection("right");
      setPrevIdx(current);
      setCurrent((prev) => (prev + 1) % total);
    }, 6000);
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

  const banner = banners[current];
  const prevBanner = banners[prevIdx];
  const isChanging = current !== prevIdx;

  if (isLoading) {
    return (
      <div className="w-full flex justify-center mb-6 sm:mb-8">
        <div className="relative w-full max-w-7xl h-[400px] sm:h-[450px] lg:h-[550px] rounded-lg sm:rounded-xl overflow-hidden shadow-xl sm:shadow-2xl bg-muted">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    );
  }

  if (!isLoading && total === 0) {
    return (
      <div className="w-full flex justify-center mb-6 sm:mb-8">
        <div className="relative w-full max-w-7xl h-[400px] sm:h-[450px] lg:h-[550px] rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 shadow-xl sm:shadow-2xl">
          <p className="text-sm sm:text-base text-white/70">Chưa có phim đang chiếu.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center mb-6 sm:mb-8 px-4">
      <div className="relative w-full max-w-7xl h-[400px] sm:h-[450px] lg:h-[550px] rounded-lg sm:rounded-xl overflow-hidden shadow-2xl">
        
        {/* Background Layer - với hiệu ứng chuyển đổi */}
        <div className="absolute inset-0">
          {/* Background hiện tại */}
          <div
            key={`bg-${current}`}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              isChanging ? 'opacity-100' : 'opacity-100'
            }`}
          >
            <Image
              src={banner.poster}
              alt=""
              fill
              priority
              className="object-cover"
            />
            {/* Overlay gradients nhiều lớp */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20"></div>
          </div>

          {/* Background trước đó - fade out */}
          {isChanging && prevBanner && (
            <div
              key={`bg-${prevIdx}`}
              className="absolute inset-0 transition-opacity duration-1000 opacity-0"
            >
              <Image
                src={prevBanner.poster}
                alt=""
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            </div>
          )}

          {/* Vignette effect */}
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>
        </div>

        {/* Main Content với animation */}
        <div className="relative h-full flex items-center justify-center px-4 sm:px-8 lg:px-16">
          <div
            key={current}
            className={`flex flex-col lg:flex-row items-center gap-6 lg:gap-12 max-w-6xl w-full transition-all duration-700 ${
              isChanging 
                ? direction === 'right'
                  ? 'animate-[slideInRight_0.7s_ease-out]'
                  : 'animate-[slideInLeft_0.7s_ease-out]'
                : ''
            }`}
          >
            
            {/* Poster với hiệu ứng */}
            <div className="flex-shrink-0 group">
              <div className="relative w-48 h-72 sm:w-56 sm:h-84 lg:w-72 lg:h-[432px] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/20 transition-all duration-500 group-hover:scale-105 group-hover:ring-yellow-400/50 group-hover:shadow-yellow-400/20">
                <Image
                  src={banner.poster}
                  alt={banner.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-transparent group-hover:via-white/10 transition-all duration-700"></div>
              </div>
            </div>

            {/* Info với stagger animation */}
            <div className="flex-1 text-white text-center lg:text-left max-w-2xl space-y-4">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold leading-tight bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent drop-shadow-lg">
                  {banner.title}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs sm:text-sm text-white/90">
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <User className="w-3.5 h-3.5" />
                    {banner.director}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <Calendar className="w-3.5 h-3.5" />
                    {banner.release}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <Clock className="w-3.5 h-3.5" />
                    {banner.duration}
                  </span>
                  {/* {banner.rating !== "N/A" && (
                    <span className="flex items-center gap-1.5 bg-yellow-400/20 text-yellow-400 px-3 py-1.5 rounded-full backdrop-blur-sm font-semibold">
                      <Star className="w-3.5 h-3.5 fill-yellow-400" />
                      {banner.rating}
                    </span>
                  )} */}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {banner.genre.split(',').map((g, idx) => (
                  <span 
                    key={idx}
                    className="inline-block bg-gradient-to-r from-yellow-400/30 to-orange-400/30 text-yellow-300 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-sm border border-yellow-400/30"
                  >
                    {g.trim()}
                  </span>
                ))}
              </div>

              <p className="text-sm sm:text-base lg:text-lg text-white/80 leading-relaxed line-clamp-3 hidden sm:block">
                {banner.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                <Link
                  href={banner.href}
                  className="group/btn relative inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/50 text-sm sm:text-base overflow-hidden"
                >
                  <span className="relative z-10">ĐẶT VÉ NGAY</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href={banner.href}
                  className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl font-semibold transition-all duration-300 backdrop-blur-md border border-white/20 hover:border-white/40 text-sm sm:text-base"
                >
                  CHI TIẾT
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons với hiệu ứng */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/30 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-30 backdrop-blur-md border border-white/10 hover:border-white/30 group"
              aria-label="Previous slide"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/30 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-30 backdrop-blur-md border border-white/10 hover:border-white/30 group"
              aria-label="Next slide"
            >
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
            </button>
          </>
        )}

        {/* Indicators với animation */}
        {total > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === current 
                    ? 'bg-yellow-400 w-10 shadow-lg shadow-yellow-400/50' 
                    : 'bg-white/40 hover:bg-white/60 w-6 hover:w-8'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Animated particles effect (optional) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}