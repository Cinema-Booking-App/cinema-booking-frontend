"use client";
import { MoviesPage } from "@/components/client/home/movies-page";

export default function UpcomingPage() {
  return (
    <MoviesPage 
      title="PHIM SẮP CHIẾU" 
      status="upcoming" 
      buttonText="XEM CHI TIẾT" 
    />
  );
} 