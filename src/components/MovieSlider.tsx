"use client";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState } from "react";
import { Movie } from "@/data/movies";
import { MovieCard } from "./MovieCard";

interface MovieSliderProps {
  movies: Movie[];
  title?: string;
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export function MovieSlider({ movies }: MovieSliderProps) {
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

  if (movies.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Không có phim nào để hiển thị</p>
      </div>
    );
  }

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
              <MovieCard key={movie.id} movie={movie} />
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
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              currentSlide === idx 
                ? 'bg-yellow-400 scale-110 shadow-lg' 
                : 'bg-accent/40'
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}
