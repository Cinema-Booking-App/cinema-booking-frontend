"use client";
import React, { useState } from "react";

export default function MoviePoster({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <img
      src={imgSrc}
      alt={alt}
      className="w-16 h-24 object-cover rounded shadow"
    />
  );
} 