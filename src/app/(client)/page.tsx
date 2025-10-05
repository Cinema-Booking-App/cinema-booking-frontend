"use client";

import { HeroBannerSlider } from "@/components/client/home/hero-banner-slider";
import { MovieSection } from "@/components/client/home/movie-section";

// import { QuickBooking } from "@/components/QuickBooking";

export default function ClientHome() {
  return (
    <div className="bg-background text-foreground min-h-screen px-2 sm:px-4 lg:px-6 py-4 transition-colors duration-300">
      {/* Banner lớn */}
      <HeroBannerSlider />
      
      {/* Đặt vé nhanh */}
      <div className="flex flex-col items-center gap-2">
        {/* <QuickBooking /> */}
      </div>
      
      {/* Phim đang chiếu */}
      <MovieSection 
        title="PHIM ĐANG CHIẾU"
        status="now_showing"
        linkHref="/showing"
        linkText="XEM THÊM"
      />
      
      {/* Phim sắp chiếu */}
      <MovieSection 
        title="PHIM SẮP CHIẾU"
        status="upcoming"
        linkHref="/upcoming"
        linkText="XEM THÊM"
      />
    </div>
  );
}