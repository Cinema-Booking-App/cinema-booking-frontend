"use client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Clock, Globe, MessageSquareText, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Movie } from "@/data/movies";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Card className="w-64 border-border shadow-xl relative group overflow-hidden bg-card transition-transform duration-300 hover:scale-[1.03]">
      {/* Badge tuổi */}
      <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
        <Badge className="font-bold" variant="secondary">{movie.badge}</Badge>
        <Badge className="bg-primary text-primary-foreground" variant="outline">
          {movie.age > 0 ? movie.age + "+" : "K"}
        </Badge>
      </div>
      
      {/* Poster */}
      <div className="w-full h-80 relative rounded-lg overflow-hidden cursor-pointer">
        <Link href={`/movie/${movie.id}`}>
          <Image 
            src={movie.poster} 
            alt={movie.title} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        </Link>
        
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
          
          {/* Nút xem chi tiết trong overlay */}
          <Link href={`/movie/${movie.id}`} className="mt-4">
            <Button variant="secondary" size="sm" className="gap-2">
              <Info className="w-4 h-4" /> Chi tiết
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Tên phim */}
      <Link href={`/movie/${movie.id}`}>
        <div className="mt-4 px-2 text-center font-bold text-base min-h-[48px] uppercase text-card-foreground hover:text-yellow-400 transition-colors cursor-pointer">
          {movie.title}
        </div>
      </Link>
      
      {/* Nút */}
      <div className="flex justify-center gap-2 mt-4 mb-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1" disabled={!movie.trailer}>
              <span role="img" aria-label="trailer">🔴</span> Trailer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl p-2" showCloseButton>
            {movie.trailer ? (
              <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
                <iframe
                  src={movie.trailer}
                  title={`Trailer ${movie.title}`}
                  className="absolute inset-0 w-full h-full rounded-md"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">Chưa có trailer</div>
            )}
          </DialogContent>
        </Dialog>
        <Link href={`/movie/${movie.id}`}>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-yellow-400 text-black font-bold hover:bg-yellow-300"
          >
            ĐẶT VÉ
          </Button>
        </Link>
      </div>
    </Card>
  );
}
