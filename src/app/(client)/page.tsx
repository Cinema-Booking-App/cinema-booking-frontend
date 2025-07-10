"use client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { BadgeCheck, Clock, Globe, MessageSquareText, ArrowLeft, ArrowRight } from "lucide-react";
import { movies, Movie } from "@/data/movies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    <div className="bg-background relative flex items-center justify-center">
      <button
        className="z-10 bg-accent/40 hover:bg-accent/70 text-accent-foreground rounded-full w-10 h-10 flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 shadow-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => instanceRef.current?.prev()}
        aria-label="Trước"
      >
        &#8592;
      </button>
      <div ref={sliderRef} className="keen-slider w-full max-w-6xl">
        {movieGroups.map((group, idx) => (
          <div className="keen-slider__slide flex gap-8 justify-center" key={idx}>
            {group.map((movie: Movie) => (
              <Card key={movie.id} className="w-64 border-border shadow-xl relative group overflow-hidden bg-card transition-transform duration-300 hover:scale-[1.03]">
                {/* Badge tuổi */}
                <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                  <Badge className="font-bold" variant="secondary">{movie.badge}</Badge>
                  <Badge className="bg-primary text-primary-foreground" variant="outline">{movie.age > 0 ? movie.age+"+" : "K"}</Badge>
                </div>
                {/* Poster */}
                <div className="w-full h-80 relative rounded-lg overflow-hidden">
                  <Image src={movie.poster} alt={movie.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-popover/90 flex flex-col justify-center items-start p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 text-popover-foreground backdrop-blur-sm">
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
                <div className="mt-4 px-2 text-center font-bold text-base min-h-[48px] uppercase text-card-foreground">{movie.title}</div>
                {/* Nút */}
                <div className="flex justify-center gap-2 mt-4 mb-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <span role="img" aria-label="trailer">🔴</span> Xem Trailer
                  </Button>
                  <Button variant="default" size="sm" className="bg-yellow-400 text-black font-bold hover:bg-yellow-300">
                    ĐẶT VÉ
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ))}
      </div>
      <button
        className="z-10 bg-accent/40 hover:bg-accent/70 text-accent-foreground rounded-full w-10 h-10 flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 shadow-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring"
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
            className={`w-3 h-3 rounded-full transition-all duration-200 ${currentSlide === idx ? 'bg-yellow-400 scale-110 shadow-lg' : 'bg-accent/40'}`}
          ></span>
        ))}
      </div>
    </div>
  );
}

const heroBanners = [
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
  {
    image: "/vercel.svg",
    title: "Siêu anh hùng",
    subtitle: "Hồi kết",
    release: "20.09.2025",
    cta: "ĐẶT VÉ NGAY",
    href: "/booking/3",
  },
  {
    image: "/window.svg",
    title: "Cửa sổ thời gian",
    subtitle: "Quay ngược quá khứ",
    release: "01.10.2025",
    cta: "ĐẶT VÉ NGAY",
    href: "/booking/4",
  },
  {
    image: "/file.svg",
    title: "Hồ sơ tuyệt mật",
    subtitle: "Bí ẩn chưa lời giải",
    release: "15.11.2025",
    cta: "ĐẶT VÉ NGAY",
    href: "/booking/5",
  },
];

function HeroBannerSlider() {
  const [current, setCurrent] = useState(0);
  const [prevIdx, setPrevIdx] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const banners = heroBanners;
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
        <h2 className="text-center text-3xl font-extrabold mb-8 tracking-wider text-foreground">PHIM ĐANG CHIẾU</h2>
        <MovieSlider movies={movies} />
        {/* Xem thêm */}
        <div className="flex justify-center mt-12">
          <Button asChild variant="default" size="lg" className="bg-yellow-400 text-black font-bold hover:bg-yellow-300">
            <Link href="/showing">XEM THÊM</Link>
          </Button>
        </div>
      </div>
      {/* Phim sắp chiếu - Slider */}
      <div className="mt-16">
        <h2 className="text-center text-3xl font-extrabold mb-8 tracking-wider text-foreground">PHIM SẮP CHIẾU</h2>
        <MovieSlider movies={comingMovies} />
        <div className="flex justify-center mt-12">
          <Button asChild variant="default" size="lg" className="bg-yellow-400 text-black font-bold hover:bg-yellow-300">
            <Link href="/upcoming">XEM THÊM</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
