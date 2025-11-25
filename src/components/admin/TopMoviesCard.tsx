import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Film, Star } from "lucide-react";

interface TopMoviesCardProps {
  movies: any[];
}

const TopMoviesCard: React.FC<TopMoviesCardProps> = ({ movies }) => (
  <Card>
    <CardHeader>
      <CardTitle>Phim phổ biến</CardTitle>
      <CardDescription>Top phim có doanh thu cao nhất</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {movies.map((movie, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={movie.image} />
            <AvatarFallback>
              <Film className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{movie.title}</p>
            <p className="text-xs text-muted-foreground">{movie.genre}</p>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs">{movie.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{movie.bookings} vé</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-green-600">{movie.revenue}</p>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default TopMoviesCard;
