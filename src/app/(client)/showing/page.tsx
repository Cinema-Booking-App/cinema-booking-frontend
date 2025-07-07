"use client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { BadgeCheck, Clock, Globe, MessageSquareText } from "lucide-react";
import { movies, Movie } from "@/data/movies";

const showingMovies = movies.filter((movie: Movie) => movie.status === "showing");

export default function ShowingPage() {
  return (
    <div className="bg-gradient-to-b from-[#181f3a] to-[#2b2562] text-white min-h-screen p-4">
      <h1 className="text-center text-3xl font-extrabold mb-8 tracking-wider">PHIM ĐANG CHIẾU</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {showingMovies.map((movie) => (
          <Card key={movie.id} className="w-full bg-[#181f3a] border-none shadow-xl relative group overflow-hidden">
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
                  <BadgeCheck className="w-4 h-4 text-white" /> {movie.genre}
                </div>
                <div className="flex items-center gap-2 mb-2 text-sm">
                  <Clock className="w-4 h-4 text-white" /> {movie.duration}
                </div>
                <div className="flex items-center gap-2 mb-2 text-sm">
                  <Globe className="w-4 h-4 text-white" /> {movie.country}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquareText className="w-4 h-4 text-white" /> {movie.subtitle}
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
    </div>
  );
} 