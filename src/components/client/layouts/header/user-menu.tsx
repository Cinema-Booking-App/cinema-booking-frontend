'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Ticket, Settings, LogOut } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { logout } from '@/store/slices/auth/authSlide';

export default function UserMenu() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      dispatch(logout());
    } catch (error) {
      dispatch(logout());
      console.error('Logout failed:', error);
    }
  };

  // Hiển thị nút đăng nhập/đăng ký khi chưa đăng nhập
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3" asChild>
          <Link href="/login">
            <span>Đăng nhập</span>
          </Link>
        </Button>
        <Button
          size="sm"
          className="bg-destructive hover:bg-destructive/90 text-white text-xs sm:text-sm px-2 sm:px-3"
          asChild
        >
          <Link href="/register">
            <span>Đăng ký</span>
          </Link>
        </Button>
      </div>
    );
  }

  // Hiển thị menu người dùng khi đã đăng nhập
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
          <p className="text-sm font-medium">{user?.full_name || 'Người dùng'}</p>
          <p className="text-xs text-muted-foreground">{user?.email || 'email@example.com'}</p>
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
        <DropdownMenuItem onClick={handleLogout} variant="destructive">
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}