import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Clock, MapPin, Users, Calendar, Ticket } from "lucide-react";

interface MovieInfo {
  title: string;
  poster: string;
  duration: string;
}

interface ScheduleInfo {
  date: string;
  time: string;
  theater: string;
  room: string;
}

interface MovieInfoCardProps {
  movie: MovieInfo;
  schedule: ScheduleInfo;
}

export const MovieInfoCard: React.FC<MovieInfoCardProps> = ({ movie, schedule }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Avatar className="w-20 h-28">
            <AvatarImage src={movie.poster} alt={movie.title} />
            <AvatarFallback>
              <Ticket className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-2">{movie.title}</h3>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                {movie.duration}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                {schedule.theater}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3" />
                {schedule.room}
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm font-medium">{schedule.date}</p>
          </div>
          <p className="text-lg font-bold text-primary">{schedule.time}</p>
        </div>
      </CardContent>
    </Card>
  );
};