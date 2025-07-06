"use client"

import { Gift, Star, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CTABanner = () => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsVisible(scrollY < 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="bg-gradient-to-r from-red-800 via-red-700 to-red-900 text-white sm:py-4 relative z-10"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.3
          }}
        >
          <div className="container mx-auto px-4">
            <Card className="bg-transparent border-amber-400/20  p-0">
              <CardContent className="sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                      <Star className="w-4 h-4 text-amber-300" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-sm sm:text-base font-semibold text-white">
                        <span className="hidden sm:inline">🎬 Khuyến mãi đặc biệt: Giảm 20% cho tất cả vé xem phim!</span>
                        <span className="sm:hidden">🎬 Giảm 20% vé xem phim!</span>
                      </span>
                      <div className="flex items-center gap-1 text-xs text-amber-200">
                        <Clock className="w-3 h-3" />
                        <span>Chỉ còn 3 ngày</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="text-red-800 bg-amber-400 hover:bg-amber-300 font-semibold text-sm px-4 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <span className="hidden sm:inline">Đặt vé ngay</span>
                    <span className="sm:hidden">Đặt vé</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CTABanner 