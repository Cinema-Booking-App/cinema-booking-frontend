"use client"

import { MapPin, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface LocationSelectorProps {
  selectedLocation: string
  locations: string[]
  onLocationChange: (location: string) => void
  isMobile?: boolean
}

const LocationSelector = ({ 
  selectedLocation, 
  locations, 
  onLocationChange, 
  isMobile = false 
}: LocationSelectorProps) => {
  if (isMobile) {
    return (
      <div className="mt-4 px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-between text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">{selectedLocation}</span>
              </div>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-full min-w-[200px]">
            {locations.map((location) => (
              <DropdownMenuItem
                key={location}
                onClick={() => onLocationChange(location)}
                className="cursor-pointer"
              >
                {location}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <div className="hidden lg:flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground"
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">{selectedLocation}</span>
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[200px]">
          {locations.map((location) => (
            <DropdownMenuItem
              key={location}
              onClick={() => onLocationChange(location)}
              className="cursor-pointer"
            >
              {location}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default LocationSelector 