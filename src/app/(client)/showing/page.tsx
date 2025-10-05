"use client";
import { MoviesPage } from "@/components/client/home/movies-page";

export default function ShowingPage() {
  return (
    <MoviesPage 
      title="PHIM ĐANG CHIẾU" 
      status="now_showing" 
      buttonText="ĐẶT VÉ" 
    />
  );
} 