"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users, Star } from "lucide-react";
import Image from "next/image";

interface MovieData {
  title: string;
  poster: string;
  duration: string;
}

interface ScheduleData {
  date: string;
  time: string;
  theater: string;
  room: string;
}

interface BookingInfoCardProps {
  movie: MovieData;
  schedule: ScheduleData;
  selectedSeats: string[];
}

export default function BookingInfoCard({ movie, schedule, selectedSeats }: BookingInfoCardProps) {
  return (
    <Card className="p-3 sm:p-4 shadow-md border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <div className="flex gap-3 sm:gap-4">
        {/* Movie Poster */}
        <div className="relative group flex-shrink-0">
          <Image
            src={movie.poster}
            alt={movie.title}
            width={80}
            height={100}
            className="rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-300 w-16 h-20 sm:w-20 sm:h-24 object-cover"
          />
        </div>

        {/* Movie Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base mb-2 text-gray-900 dark:text-white line-clamp-2">
            {movie.title}
          </h3>
          
          {/* Schedule Info - Compact */}
          <div className="space-y-1.5 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-blue-600 flex-shrink-0" />
              <span className="font-medium">{schedule.date} • {schedule.time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-green-600 flex-shrink-0" />
              <span className="font-medium truncate">{schedule.theater}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3 h-3 text-purple-600 flex-shrink-0" />
              <span className="font-medium">{schedule.room}</span>
            </div>
          </div>

          {/* Selected Seats - Compact */}
          <div className="mt-2">
            <p className="text-xs font-medium mb-1">Ghế: </p>
            <div className="flex flex-wrap gap-1">
              {selectedSeats.map((seat) => (
                <Badge 
                  key={seat} 
                  className="bg-red-500 text-white text-xs px-1.5 py-0.5 h-auto"
                >
                  {seat}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}