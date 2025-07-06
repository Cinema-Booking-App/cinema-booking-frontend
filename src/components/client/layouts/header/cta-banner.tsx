"use client"

import { Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CTABanner = () => {
  return (
    <div className="bg-gradient-to-r from-red-800 to-red-900 text-white py-2 sm:py-3">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          <span className="text-xs sm:text-sm font-medium">
            <span className="hidden sm:inline">🎬 Khuyến mãi đặc biệt: Giảm 20% cho tất cả vé xem phim!</span>
            <span className="sm:hidden">🎬 Giảm 20% vé xem phim!</span>
          </span>
        </div>
        <Button size="sm" variant="secondary" className="text-red-800 bg-amber-400 hover:bg-amber-300 font-medium text-xs sm:text-sm px-2 sm:px-3">
          <span className="hidden sm:inline">Đặt vé ngay</span>
          <span className="sm:hidden">Đặt vé</span>
        </Button>
      </div>
    </div>
  )
}

export default CTABanner 