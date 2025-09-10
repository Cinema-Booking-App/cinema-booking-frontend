"use client";
import { MoviesPage } from "@/components/MoviesPage";

export default function ShowingPage() {
  return (
    <MoviesPage 
      title="PHIM ĐANG CHIẾU" 
      status="now_showing" 
      buttonText="ĐẶT VÉ" 
    />
  );
} 