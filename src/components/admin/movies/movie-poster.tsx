"use client";

export default function MoviePoster({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-16 h-24 object-cover rounded shadow"
    />
  );
} 