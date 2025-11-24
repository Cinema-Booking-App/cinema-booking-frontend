"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MovieSlider } from "@/components/client/home/movies-slider";
import { useGetListMoviesQuery } from "@/store/slices/movies/moviesApi";
import { MovieSliderSkeleton } from "./movie-card-skeleton";

interface MovieSectionProps {
  title: string;
  status: 'now_showing' | 'upcoming';
  linkHref: string;
  linkText: string;
}

export function MovieSection({ title, status, linkHref, linkText }: MovieSectionProps) {
  const { 
    data: moviesData, 
    isLoading, 
    error 
  } = useGetListMoviesQuery({ 
    limit: 20, 
    status: status 
  });
  const movies = moviesData?.items || [];


  return (
    <div className="mt-4 xs:mt-6 sm:mt-12 lg:mt-16">
      <h2 className="text-center text-lg xs:text-xl sm:text-2xl lg:text-3xl font-extrabold mb-3 xs:mb-4 sm:mb-8 tracking-wider text-foreground">
        {title}
      </h2>
      {isLoading ? (
        <MovieSliderSkeleton />
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">Có lỗi khi tải dữ liệu {title.toLowerCase()}</p>
        </div>
      ) : (
        <MovieSlider movies={movies} />
      )}
      {/* Xem thêm */}
      <div className="flex justify-center mt-4 xs:mt-6 sm:mt-10 lg:mt-12">
        <Button asChild variant="default" size="sm" className="bg-yellow-400 text-black font-bold hover:bg-yellow-300 sm:size-default lg:size-lg px-6 sm:px-8">
          <Link href={linkHref}>{linkText}</Link>
        </Button>
      </div>
    </div>
  );
}