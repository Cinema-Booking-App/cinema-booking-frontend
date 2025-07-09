"use client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { BadgeCheck, Clock, Globe, MessageSquareText } from "lucide-react";
import { movies, Movie } from "@/data/movies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const upcomingMovies = movies.filter((movie: Movie) => movie.status === "upcoming");

export default function UpcomingPage() {
  return (
    <div className="bg-background text-foreground min-h-screen p-4 transition-colors duration-300">
      <h1 className="text-center text-3xl font-extrabold mb-8 tracking-wider text-foreground">PHIM SẮP CHIẾU</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {upcomingMovies.map((movie) => (
          <Card key={movie.id} className="w-full border-border shadow-xl relative group overflow-hidden bg-card transition-transform duration-300 hover:scale-[1.03]">
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
    </div>
  );
} 