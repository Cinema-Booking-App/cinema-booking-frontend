"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetMovieByIdQuery } from "@/store/slices/movies/moviesApi";
import { useGetListShowtimesQuery } from "@/store/slices/showtimes/showtimesApi";
import { transformMovieFromAPI } from "@/data/movies";
import { Calendar, Clock, Globe, User, MapPin } from "lucide-react";

// Helper function để format duration
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h${mins > 0 ? ` ${mins}p` : ''}`;
  }
  return `${mins} phút`;
};

// Helper function để format date
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

// Component Loading cho trang chi tiết
function MovieDetailSkeleton() {
  return (
    <div className="bg-background text-white min-h-screen pb-24">
      {/* Banner skeleton */}
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden">
        <Skeleton className="w-full h-full bg-gray-800" />
        <div className="absolute bottom-6 left-6 md:left-16 flex items-center gap-6">
          <Skeleton className="w-40 h-60 bg-gray-700" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-96 bg-gray-700" />
            <Skeleton className="h-4 w-80 bg-gray-700" />
            <Skeleton className="h-4 w-60 bg-gray-700" />
            <Skeleton className="h-4 w-72 bg-gray-700" />
          </div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <Skeleton className="h-12 w-96 bg-gray-800 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-64 w-full bg-gray-800" />
          <Skeleton className="h-4 w-full bg-gray-800" />
          <Skeleton className="h-4 w-3/4 bg-gray-800" />
        </div>
      </div>
    </div>
  );
}

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = parseInt(params.id as string);

  // Lấy dữ liệu phim từ API
  const { 
    data: movieData, 
    isLoading: movieLoading, 
    error: movieError 
  } = useGetMovieByIdQuery(movieId);

  // Lấy dữ liệu lịch chiếu từ API
  const { 
    data: showtimesData, 
    isLoading: showtimesLoading 
  } = useGetListShowtimesQuery();

  if (movieLoading) {
    return <MovieDetailSkeleton />;
  }

  if (movieError || !movieData) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Không tìm thấy thông tin phim</h1>
          <p className="text-gray-400">Phim không tồn tại hoặc đã bị xóa.</p>
        </div>
      </div>
    );
  }

  // Transform dữ liệu từ API
  const movie = transformMovieFromAPI(movieData);

  return (
    <div className="bg-background text-white min-h-screen pb-24 container mx-auto">
      {/* Banner section */}
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden">
        <Image
          src={movie.poster}
          alt="banner"
          fill
          className="object-cover opacity-40"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        <div className="absolute bottom-6 left-6 md:left-16 flex items-center gap-6">
          <Image
            src={movie.poster}
            alt="poster"
            width={160}
            height={240}
            className="rounded-xl shadow-xl"
          />
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="font-bold">{movie.badge}</Badge>
              <Badge variant="outline" className="bg-primary text-primary-foreground">
                {movie.age > 0 ? movie.age + "+" : "K"}
              </Badge>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-bold text-red-600 mb-2">
              {movie.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm md:text-base text-gray-300">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDuration(movieData.duration)}
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {movie.genre}
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              Khởi chiếu: {formatDate(movieData.release_date)}
            </div>
            
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <User className="w-4 h-4" />
              Đạo diễn: {movieData.director}
            </div>
            
            <p className="text-sm text-gray-400">Diễn viên: {movieData.actors}</p>
          </div>
        </div>
      </div>

      {/* Tabs section */}
      <div className=" mx-auto px-4 py-10">
        <Tabs defaultValue="trailer">
          <TabsList className="bg-background rounded-md mb-6">
            <TabsTrigger value="trailer">🎬 Trailer</TabsTrigger>
            <TabsTrigger value="description">📄 Mô tả</TabsTrigger>
            <TabsTrigger value="schedule">🗓 Lịch chiếu</TabsTrigger>
            <TabsTrigger value="comments">💬 Bình luận</TabsTrigger>
          </TabsList>

          <TabsContent value="trailer">
            {movie.trailer ? (
              <div className="aspect-video rounded-xl overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src={movie.trailer}
                  title={`Trailer ${movie.title}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="aspect-video bg-gray-800 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">🎬</div>
                  <p>Chưa có trailer</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="description">
            <div className="bg-gray-900 rounded-xl p-6">
              <p className="text-base text-gray-300 leading-relaxed">
                {movieData.description || 'Chưa có mô tả cho phim này.'}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="schedule">
            <div className="space-y-6">
              {showtimesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-800 rounded-xl p-4">
                      <Skeleton className="h-6 w-40 bg-gray-700 mb-2" />
                      <Skeleton className="h-4 w-32 bg-gray-700 mb-2" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-16 bg-gray-700" />
                        <Skeleton className="h-8 w-16 bg-gray-700" />
                        <Skeleton className="h-8 w-16 bg-gray-700" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : showtimesData && showtimesData.length > 0 ? (
                (() => {
                  const movieShowtimes = showtimesData.filter((showtime: any) => showtime.movie_id === movieId);
                  const groupedByTheater = movieShowtimes.reduce((grouped: Record<string, any[]>, showtime: any) => {
                    const theaterName = showtime.theater?.name || 'Rạp không xác định';
                    if (!grouped[theaterName]) {
                      grouped[theaterName] = [];
                    }
                    grouped[theaterName].push(showtime);
                    return grouped;
                  }, {} as Record<string, any[]>);

                  return Object.entries(groupedByTheater).map(([theaterName, showtimes]) => (
                    <div key={theaterName} className="bg-gray-800 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <h4 className="text-lg font-semibold text-red-500">{theaterName}</h4>
                      </div>
                      <div className="space-y-2">
                        {(showtimes as any[]).map((showtime: any) => (
                          <div key={showtime.showtime_id} className="mb-3">
                            <p className="text-sm text-gray-400 mb-2">
                              {formatDate(showtime.show_date)} - Phòng {showtime.room?.name || 'N/A'}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-amber-400 text-black hover:bg-amber-300 font-medium"
                            >
                              {new Date(`1970-01-01T${showtime.show_time}`).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ));
                })()
              ) : (
                <div className="bg-gray-800 rounded-xl p-8 text-center">
                  <div className="text-4xl mb-4">🎭</div>
                  <p className="text-gray-400">Hiện tại chưa có lịch chiếu cho phim này.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="comments">
            <div className="bg-gray-900 rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">💬</div>
              <p className="italic text-muted-foreground text-sm">
                Chức năng bình luận sẽ được cập nhật sớm.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Nút đặt vé cố định */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-amber-400 text-black hover:bg-amber-300 font-bold shadow-lg"
          size="lg"
        >
          <span className="hidden sm:inline">Đặt vé ngay</span>
          <span className="sm:hidden">Đặt vé</span>
        </Button>
      </div>
    </div>
  );
}