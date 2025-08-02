import Image from "next/image";

export default function CombosPoster({ src, alt }: { src: string; alt: string }) {
  return (
    src ? (
      <Image
        src={src}
        alt={alt}
        width={48}
        height={48}
        className="object-cover rounded shadow"
        loading="eager"
        priority={true}
      />
    ) : (
      <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
        N/A
      </div>
    )
  );
}
