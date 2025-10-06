"use client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { BadgeCheck, Clock, Globe, MessageSquareText, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useGetListMoviesQuery } from "@/store/slices/movies/moviesApi";
import { Movies } from "@/types/movies";

interface MoviesPageProps {
  title: string;
  status: 'now_showing' | 'upcoming';
  buttonText?: string;
}

// Loading component cho movie cards
function MovieCardSkeleton() {
  return (
    <Card className="w-full border-border shadow-xl relative overflow-hidden bg-card">
      <Skeleton className="w-full h-80" />
      <div className="mt-4 px-2 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex justify-center gap-2 mt-4 mb-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>
    </Card>
  );
}

// Component MovieCard
function MovieCard({ movie, buttonText = "ĐẶT VÉ" }: { movie: Movies; buttonText?: string }) {
  return (
    <Card className="w-full border-border shadow-xl relative group overflow-hidden bg-card transition-transform duration-300 hover:scale-[1.03]">
      {/* Badge tuổi */}
      <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
        <Badge className="font-bold" variant="secondary">{movie.genre}</Badge>
        <Badge className="bg-primary text-primary-foreground" variant="outline">
          {movie.age_rating}
        </Badge>
      </div>
      
      {/* Poster */}
      <div className="w-full h-80 relative rounded-lg overflow-hidden">
        <Image 
          src={movie.poster_url} 
          alt={movie.title} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-300" 
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-popover/90 flex flex-col justify-center items-start p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 text-popover-foreground backdrop-blur-sm">
          <div className="font-bold text-lg mb-4 leading-snug">{movie.title}</div>
          <div className="flex items-center gap-2 mb-2 text-sm">
            <BadgeCheck className="w-4 h-4 text-yellow-400" /> {movie.genre}
          </div>
          <div className="flex items-center gap-2 mb-2 text-sm">
            <Clock className="w-4 h-4 text-yellow-400" /> {movie.duration} phút
          </div>
          <div className="flex items-center gap-2 mb-2 text-sm">
            <Globe className="w-4 h-4 text-yellow-400" /> Việt Nam
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MessageSquareText className="w-4 h-4 text-yellow-400" /> Phụ đề / Lồng tiếng
          </div>
        </div>
      </div>
      
      {/* Tên phim */}
      <div className="mt-4 px-2 text-center font-bold text-base min-h-[48px] uppercase text-card-foreground">
        {movie.title}
      </div>
      
      {/* Nút */}
      <div className="flex justify-center gap-2 mt-4 mb-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1" disabled={!movie.trailer_url}>
              <span role="img" aria-label="trailer">🔴</span> Xem Trailer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl p-2" showCloseButton>
            {movie.trailer_url ? (
              <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
                <iframe
                  src={movie.trailer_url}
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
        <Link href={`/movie/${movie.movie_id}`}>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-yellow-400 text-black font-bold hover:bg-yellow-300"
          >
            {buttonText}
          </Button>
        </Link>
      </div>
    </Card>
  );
}

export function MoviesPage({ title, status, buttonText = "ĐẶT VÉ" }: MoviesPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Lấy dữ liệu phim từ API
  const { 
    data: moviesData, 
    isLoading, 
    error 
  } = useGetListMoviesQuery({ 
    limit: 100, // Lấy nhiều để có thể phân trang
    status: status,
    search_query: searchQuery || undefined
  });

  // Chuyển đổi dữ liệu từ API
  const allMovies = useMemo(() => { 
    return moviesData?.items || [];
  }, [moviesData?.items]);

  // Lọc phim theo tìm kiếm
  const filteredMovies = useMemo(() => {
    if (!searchQuery) return allMovies;
    return allMovies.filter(movie => 
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allMovies, searchQuery]);

  // Phân trang
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMovies = filteredMovies.slice(startIndex, endIndex);

  // Reset trang khi tìm kiếm
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="bg-background text-foreground min-h-screen p-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-center text-3xl font-extrabold mb-8 tracking-wider text-foreground">
          {title}
        </h1>

        {/* Thanh tìm kiếm */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Tìm kiếm phim theo tên hoặc thể loại..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        {/* Thống kê */}
        <div className="mb-6 text-center">
          <p className="text-muted-foreground">
            {isLoading ? "Đang tải..." : `Tìm thấy ${filteredMovies.length} phim`}
          </p>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, idx) => (
              <MovieCardSkeleton key={idx} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">Có lỗi khi tải dữ liệu phim</p>
            <Button onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchQuery ? "Không tìm thấy phim nào phù hợp" : `Hiện tại không có phim nào ${status === 'now_showing' ? 'đang chiếu' : 'sắp chiếu'}`}
            </p>
          </div>
        ) : (
          <>
            {/* Danh sách phim */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {currentMovies.map((movie) => (
                <MovieCard key={movie.movie_id} movie={movie} buttonText={buttonText} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Trước
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "bg-yellow-400 text-black" : ""}
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
