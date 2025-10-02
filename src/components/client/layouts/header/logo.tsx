"use client"; // Keep this for client-side features

import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 group transition-all duration-300 ease-in-out"
    >
      {/* Logo Icon */}
      <div
        className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl 
        flex items-center justify-center shadow-md group-hover:shadow-lg 
        group-hover:scale-105 transition-all duration-300"
      >
        <span className="text-white font-extrabold text-xl sm:text-2xl relative">
          C
          <span
            className="absolute text-sm sm:text-sm "
            style={{ top: "0.1em", right: "-0.8em" }}
          >
            +
          </span>
        </span>
      </div>
      {/* Logo Text */}
      <span
        className="text-xl sm:text-2xl font-extrabold text-foreground 
        hidden sm:block bg-clip-text text-transparent 
        bg-gradient-to-r from-red-500 to-rose-600 
        group-hover:from-red-600 group-hover:to-rose-700 
        transition-all duration-300"
      >
        CinePlus+
      </span>
      <span
        className="text-xl font-extrabold text-foreground sm:hidden 
        bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-600"
      >
        CP
      </span>
    </Link>
  );
};

export default Logo;
