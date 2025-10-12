"use client"

import { Globe } from 'lucide-react'
import Navigation from './navigation'
import { LucideIcon } from 'lucide-react'

interface NavigationItem {
  name: string
  href: string
  icon: LucideIcon
}

interface MobileMenuProps {
  isOpen: boolean
  navigationItems: NavigationItem[]
  selectedLocation: string
  locations: string[]
  languages: string[]
  onLocationChange: (location: string) => void
  onItemClick: () => void
}

const MobileMenu = ({ 
  isOpen, 
  navigationItems, 
  selectedLocation, 
  locations, 
  languages, 
  onLocationChange, 
  onItemClick 
}: MobileMenuProps) => {
  if (!isOpen) return null

  return (
    <div className="xl:hidden mt-4 pb-4 border-t border-border pt-4">
      <Navigation 
        items={navigationItems} 
        isMobile={true} 
        onItemClick={onItemClick} 
      />

      <div className="mt-4 px-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <select className="bg-transparent border-none outline-none text-sm text-muted-foreground">
            {languages.map((lang) => (
              <option key={lang} value={lang} className="bg-background">{lang}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default MobileMenu 