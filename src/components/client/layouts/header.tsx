"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Home, Calendar, Building, Gift, Ticket } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import TopBar from './header/top-bar'
import Logo from './header/logo'
import Navigation from './header/navigation'
import SearchBar from './header/search-bar'
import LocationSelector from './header/location-selector'
import CartButton from './header/cart-button'
import UserMenu from './header/user-menu'
import MobileMenu from './header/mobile-menu'
import CTABanner from './header/cta-banner'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState('Hà Nội')
  const [cartCount, setCartCount] = useState(2) // Mock data
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Mock data

  const navigationItems = [
    { name: 'Trang chủ', href: '/', icon: Home },
    { name: 'Lịch chiếu', href: '/lich-chieu', icon: Calendar },
    { name: 'Rạp chiếu', href: '/rap-chieu', icon: Building },
    { name: 'Khuyến mãi', href: '/khuyen-mai', icon: Gift },
    { name: 'Vé của tôi', href: '/ve-cua-toi', icon: Ticket },
  ]

  const locations = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ']
  const languages = ['Tiếng Việt', 'English']

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="bg-background border-b border-border shadow-lg sticky top-0 z-50">
      {/* Top bar */}
      <TopBar languages={languages} />

      {/* Main header */}
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
            <Logo />

            {/* Desktop Navigation */}
            <Navigation items={navigationItems} />
          </div>

          {/* Search Bar */}
          <SearchBar />

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            {/* Location Selector */}
            <LocationSelector
              selectedLocation={selectedLocation}
              locations={locations}
              onLocationChange={setSelectedLocation}
            />

            {/* Cart */}
            <CartButton cartCount={cartCount} />

            {/* User Menu */}
            <UserMenu isLoggedIn={isLoggedIn} />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="xl:hidden text-muted-foreground hover:text-accent-foreground"
            >
              {isMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <SearchBar isMobile={true} />

        {/* Mobile Navigation */}
        <MobileMenu
          isOpen={isMenuOpen}
          navigationItems={navigationItems}
          selectedLocation={selectedLocation}
          locations={locations}
          languages={languages}
          onLocationChange={setSelectedLocation}
          onItemClick={() => setIsMenuOpen(false)}
        />
      </div>

      {/* CTA Banner */}
      <CTABanner />
    </header>
  )
}

export default Header
