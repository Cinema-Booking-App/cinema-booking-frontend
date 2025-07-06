"use client"

import Link from 'next/link'

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-destructive rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg sm:text-xl">C</span>
      </div>
      <span className="text-lg sm:text-xl font-bold text-foreground hidden sm:block">CinemaBooking</span>
      <span className="text-lg font-bold text-foreground sm:hidden">CB</span>
    </Link>
  )
}

export default Logo 