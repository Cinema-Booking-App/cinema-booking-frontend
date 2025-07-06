"use client"

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  isMobile?: boolean
}

const SearchBar = ({ isMobile = false }: SearchBarProps) => {
  if (isMobile) {
    return (
      <div className="lg:hidden mt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Tìm kiếm phim, rạp chiếu..."
            className="pl-10 pr-4 text-sm"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md mx-4 xl:mx-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Tìm kiếm phim, rạp chiếu..."
          className="pl-10 pr-4 text-sm"
        />
      </div>
    </div>
  )
}

export default SearchBar 