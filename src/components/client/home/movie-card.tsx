"use client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Clock, Globe, MessageSquareText, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Movie } from "@/data/movies";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Card className="w-48 sm:w-56 lg:w-64 border-border shadow-lg sm:shadow-xl relative group overflow-hidden bg-card transition-transform duration-300 hover:scale-[1.02] sm:hover:scale-[1.03] flex-shrink-0">
      {/* Badge tuổi */}
      <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 flex items-center gap-1 z-10">
        <Badge className="font-bold text-xs sm:text-sm px-1.5 py-0.5 sm:px-2 sm:py-1" variant="secondary">{movie.badge}</Badge>
        <Badge className="bg-primary text-primary-foreground text-xs sm:text-sm px-1.5 py-0.5 sm:px-2 sm:py-1" variant="outline">
          {movie.age > 0 ? movie.age + "+" : "K"}
        </Badge>
      </div>

      {/* Poster */}
      <div className="w-full h-64 sm:h-72 lg:h-80 relative rounded-lg overflow-hidden cursor-pointer">
        <Link href={`/movie/${movie.id}`}>
          <div className="relative w-full h-full">

            <Image
              src={movie.poster}
              alt={movie.title}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 12rem, (max-width: 768px) 14rem, 16rem"
            />
          </div>
        </Link>

        {/* Overlay - ẩn trên mobile */}
        <div className="hidden sm:flex absolute inset-0 bg-popover/90 flex-col justify-center items-start p-4 lg:p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 text-popover-foreground backdrop-blur-sm">
          <div className="font-bold text-base lg:text-lg mb-3 lg:mb-4 leading-snug">{movie.title}</div>
          <div className="flex items-center gap-2 mb-2 text-xs lg:text-sm">
            <BadgeCheck className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400" /> {movie.genre}
          </div>
          <div className="flex items-center gap-2 mb-2 text-xs lg:text-sm">
            <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400" /> {movie.duration}
          </div>
          <div className="flex items-center gap-2 mb-2 text-xs lg:text-sm">
            <Globe className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400" /> {movie.country}
          </div>
          <div className="flex items-center gap-2 text-xs lg:text-sm">
            <MessageSquareText className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400" /> {movie.subtitle}
          </div>
        </div>
      </div>

      {/* Tên phim */}
      <Link href={`/movie/${movie.id}`}>
        <div className="mt-1 sm:mt-2 px-2 text-center font-bold text-sm sm:text-base min-h-[32px] sm:min-h-[40px] uppercase text-card-foreground hover:text-yellow-400 transition-colors cursor-pointer line-clamp-2">
          {movie.title}
        </div>
      </Link>

      {/* Nút */}
      <div className="flex justify-center gap-1 sm:gap-2 mt-1 sm:mt-2 mb-2 px-2">
        <Link href={`/movie/${movie.id}`}>
          <Button
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm px-2 sm:px-3 border-muted-foreground/30 hover:border-primary hover:text-primary"
          >
            <Info className="w-3 h-3 mr-1" /> CHI TIẾT
          </Button>
        </Link>
        <Link href={`/movie/${movie.id}`} className="flex-1 sm:flex-none">
          <Button
            variant="default"
            size="sm"
            className="bg-yellow-400 text-black font-bold hover:bg-yellow-300 text-xs sm:text-sm px-2 sm:px-3 w-full sm:w-auto"
          >
            ĐẶT VÉ
          </Button>
        </Link>
      </div>
    </Card>
  );
}
