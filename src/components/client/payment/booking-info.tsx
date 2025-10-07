"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users, Star } from "lucide-react";
import Image from "next/image";
import { MovieData, ScheduleData } from "./types";


interface BookingInfoProps {
  movie: MovieData;
  schedule: ScheduleData;
  selectedSeats: string[];
}

export default function BookingInfo({ movie, schedule, selectedSeats }: BookingInfoProps) {
  return (
    <Card className="p-4 sm:p-6 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
        Thông tin đặt vé
      </h2>
      
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Movie Poster */}
        <div className="relative group flex-shrink-0 mx-auto sm:mx-0">
          <Image
            src={movie.poster}
            alt={movie.title}
            width={120}
            height={150}
            className="rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300 w-24 h-32 sm:w-28 sm:h-36 md:w-32 md:h-40 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Movie Details */}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-gray-900 dark:text-white line-clamp-2">
            {movie.title}
          </h3>
          
          {/* Schedule Info */}
          <div className="space-y-2 sm:space-y-3 text-sm">
            <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="font-medium">{schedule.date} • {schedule.time}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="font-medium truncate">{schedule.theater}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <Users className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span className="font-medium">{schedule.room}</span>
            </div>
          </div>

          {/* Selected Seats */}
          <div className="mt-4">
            <p className="text-sm font-semibold mb-2">Ghế đã chọn:</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-1 sm:gap-2">
              {selectedSeats.map((seat) => (
                <Badge 
                  key={seat} 
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-xs sm:text-sm"
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