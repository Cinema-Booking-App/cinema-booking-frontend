"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetListMoviesQuery } from "@/store/slices/movies/moviesApi";

// Fallback banners nếu không có dữ liệu từ API
const fallbackBanners = [
  {
    image: "https://api-website.cinestar.com.vn/media/MageINIC/bannerslider/mang-me-di-bo_2_.jpg",
    title: "",
    subtitle: "Tái sinh",
    release: "04.08.2025",
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

export function HeroBannerSlider() {
  const [current, setCurrent] = useState(0);
  const [prevIdx, setPrevIdx] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Lấy dữ liệu phim nổi bật từ API
  const { data: featuredMoviesData, isLoading } = useGetListMoviesQuery({ 
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
      <div className="w-full flex justify-center mb-6 sm:mb-8">
        <div className="relative w-full max-w-6xl aspect-[2/1] sm:aspect-[2.5/1] lg:aspect-[3.5/1] rounded-lg sm:rounded-xl overflow-hidden shadow-xl sm:shadow-2xl bg-muted">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center mb-6 sm:mb-8">
      <div className="relative w-full max-w-6xl aspect-[2/1] sm:aspect-[2.5/1] lg:aspect-[3.5/1] rounded-lg sm:rounded-xl overflow-hidden shadow-xl sm:shadow-2xl bg-muted">
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
            className="object-cover"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent"></div>
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 lg:px-8 text-white z-10">
            <div className="max-w-xs sm:max-w-md lg:max-w-lg">
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-1 sm:mb-2 leading-tight">{banner.title}</h1>
              <p className="text-sm sm:text-base lg:text-lg mb-1 hidden sm:block">{banner.subtitle}</p>
              <p className="text-xs sm:text-sm opacity-90 mb-2 sm:mb-4">Khởi chiếu: {banner.release}</p>
              <Link
                href={banner.href}
                className="inline-block bg-yellow-400 text-black px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-md sm:rounded-lg font-bold hover:bg-yellow-300 transition-colors text-xs sm:text-sm lg:text-base"
              >
                <span className="sm:hidden">ĐẶT VÉ</span>
                <span className="hidden sm:inline">{banner.cta}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Banner trước (cho animation) */}
        {isChanging && (
          <div
            key={prevIdx}
            className={`absolute inset-0 transition-all duration-700 ease-in-out z-10
              ${direction === 'right' ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'}
            `}
          >
            <Image
              src={prevBanner.image}
              alt={prevBanner.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent"></div>
            <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 lg:px-8 text-white">
              <div className="max-w-xs sm:max-w-md lg:max-w-lg">
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-1 sm:mb-2 leading-tight">{prevBanner.title}</h1>
                <p className="text-sm sm:text-base lg:text-lg mb-1 hidden sm:block">{prevBanner.subtitle}</p>
                <p className="text-xs sm:text-sm opacity-90 mb-2 sm:mb-4">Khởi chiếu: {prevBanner.release}</p>
                <Link
                  href={prevBanner.href}
                  className="inline-block bg-yellow-400 text-black px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-md sm:rounded-lg font-bold hover:bg-yellow-300 transition-colors text-xs sm:text-sm lg:text-base"
                >
                  <span className="sm:hidden">ĐẶT VÉ</span>
                  <span className="hidden sm:inline">{prevBanner.cta}</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <button
          onClick={prev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors z-30"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors z-30"
        >
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2 z-30">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                idx === current ? 'bg-yellow-400' : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}