"use client";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState } from "react";
import { Movie } from "@/data/movies";
import { MovieCard } from "./movie-card";

interface MovieSliderProps {
  movies: Movie[];
  title?: string;
}

// Function chunkArray đã được xóa vì không còn sử dụng

export function MovieSlider({ movies }: MovieSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    breakpoints: {
      '(min-width: 400px)': {
        slides: { origin: 'auto', perView: 1.5, spacing: 16 },
      },
      '(min-width: 640px)': {
        slides: { origin: 'auto', perView: 2.5, spacing: 20 },
      },
      '(min-width: 768px)': {
        slides: { origin: 'auto', perView: 3, spacing: 24 },
      },
      '(min-width: 1024px)': {
        slides: { origin: 'auto', perView: 4, spacing: 28 },
      },
      '(min-width: 1280px)': {
        slides: { origin: 'auto', perView: 5, spacing: 32 },
      },
    },
    slides: { origin: 'auto', perView: 1.2, spacing: 12 },
    loop: false,
  });

  if (movies.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Không có phim nào để hiển thị</p>
      </div>
    );
  }

  return (
    <div className="bg-background relative px-2 sm:px-4 lg:px-6">
      <button
        className="hidden sm:flex z-10 bg-accent/40 hover:bg-accent/70 text-accent-foreground rounded-full w-8 h-8 lg:w-10 lg:h-10 items-center justify-center absolute left-0 lg:left-2 top-1/2 -translate-y-1/2 shadow-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => instanceRef.current?.prev()}
        aria-label="Trước"
      >
        &#8592;
      </button>
      
      <div ref={sliderRef} className="keen-slider w-full max-w-7xl mx-auto">
        {movies.map((movie: Movie) => (
          <div className="keen-slider__slide" key={movie.id}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
      
      <button
        className="hidden sm:flex z-10 bg-accent/40 hover:bg-accent/70 text-accent-foreground rounded-full w-8 h-8 lg:w-10 lg:h-10 items-center justify-center absolute right-0 lg:right-2 top-1/2 -translate-y-1/2 shadow-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => instanceRef.current?.next()}
        aria-label="Sau"
      >
        &#8594;
      </button>
      
      {/* Pagination dots - ẩn trên mobile */}
      <div className="hidden sm:flex justify-center mt-6 gap-1 sm:gap-2 absolute left-1/2 -translate-x-1/2 bottom-[-40px]">
        {Array.from({ length: Math.ceil(movies.length / 4) }).map((_, idx) => (
          <span
            key={idx}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
              Math.floor(currentSlide / 4) === idx
                ? 'bg-yellow-400 scale-110 shadow-lg' 
                : 'bg-accent/40'
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}
