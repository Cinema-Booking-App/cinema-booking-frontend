"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { User, Ticket, Settings, LogOut } from 'lucide-react'

interface UserMenuProps {
  isLoggedIn: boolean
  userName?: string
  userEmail?: string
}

const UserMenu = ({ isLoggedIn, userName = "Nguyễn Văn A", userEmail = "nguyenvana@email.com" }: UserMenuProps) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen)

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
          <span>Đăng nhập</span>
        </Button>
        <Button size="sm" className="bg-destructive hover:bg-destructive/90 text-white text-xs sm:text-sm px-2 sm:px-3">
          <span>Đăng ký</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleUserMenu}
        className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground"
      >
        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
          <User className="w-4 h-4" />
        </div>
      </Button>
      
      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-popover rounded-md shadow-lg border border-border py-1 z-50">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-sm font-medium text-popover-foreground">{userName}</p>
            <p className="text-xs text-muted-foreground">{userEmail}</p>
          </div>
          <Link href="/ho-so" className="flex items-center gap-2 px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground">
            <User className="w-4 h-4" />
            Hồ sơ
          </Link>
          <Link href="/ve-cua-toi" className="flex items-center gap-2 px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground">
            <Ticket className="w-4 h-4" />
            Vé của tôi
          </Link>
          <Link href="/cai-dat" className="flex items-center gap-2 px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground">
            <Settings className="w-4 h-4" />
            Cài đặt
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground w-full text-left">
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu 