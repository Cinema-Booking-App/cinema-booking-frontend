"use client"

import { MapPin, ChevronDown } from 'lucide-react'

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
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-medium text-muted-foreground"
          >
            {locations.map((location) => (
              <option key={location} value={location} className="bg-background">{location}</option>
            ))}
          </select>
        </div>
      </div>
    )
  }

  return (
    <div className="hidden lg:flex items-center gap-2 relative group">
      <MapPin className="w-4 h-4 text-muted-foreground" />
      <select
        value={selectedLocation}
        onChange={(e) => onLocationChange(e.target.value)}
        className="bg-transparent border-none outline-none text-sm font-medium cursor-pointer text-muted-foreground"
      >
        {locations.map((location) => (
          <option key={location} value={location} className="bg-background">{location}</option>
        ))}
      </select>
      <ChevronDown className="w-3 h-3 text-muted-foreground" />
    </div>
  )
}

export default LocationSelector 