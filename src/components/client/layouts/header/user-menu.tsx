


"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, Ticket, Settings, LogOut } from 'lucide-react'

interface UserMenuProps {
  isLoggedIn: boolean
  userName?: string
  userEmail?: string
}

const UserMenu = ({ isLoggedIn, userName = "Nguyễn Văn A", userEmail = "nguyenvana@email.com" }: UserMenuProps) => {
  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3" asChild>
          <Link href="/login">
            <span>Đăng nhập</span>
          </Link>
        </Button>
        <Button size="sm" className="bg-destructive hover:bg-destructive/90 text-white text-xs sm:text-sm px-2 sm:px-3" asChild>
          <Link href="/register">
            <span>Đăng ký</span>
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground"
        >
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>
          <p className="text-sm font-medium">{userName}</p>
          <p className="text-xs text-muted-foreground">{userEmail}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Hồ sơ
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/ve-cua-toi" className="flex items-center gap-2">
            <Ticket className="w-4 h-4" />
            Vé của tôi
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/cai-dat" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Cài đặt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu 