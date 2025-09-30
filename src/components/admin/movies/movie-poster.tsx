"use client";
import Image from "next/image";

export default function MoviePoster({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={64}
      height={96}
      className="object-cover rounded shadow"
    />
  );
} 