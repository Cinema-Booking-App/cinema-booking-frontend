"use client";

import Link from "next/link";
import React from "react";
import {
  Home,
  Users,
  Film,
  Calendar,
  Ticket,
  Settings,
  BarChart3,
  LogOut,
  Building,
  UserCheck,
  Percent,
  Monitor,
  Database,
  Shield,
  MessageSquare,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Logo from "../client/layouts/header/logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// Định nghĩa kiểu dữ liệu cho phân quyền - đơn giản hóa
export type Permission =
  | 'dashboard'
  | 'movies'
  | 'schedules'
  | 'rooms'
  | 'seats'
  | 'combos'
  | 'bookings'
  | 'members'
  | 'staff'
  | 'theaters'
  | 'customers'
  | 'promotions'
  | 'reports'
  | 'content'
  | 'maintenance'
  | 'permissions'
  | 'support'
  | 'settings';

export type UserRole = 'general_manager' | 'cinema_manager' | 'counter_staff';

export interface SidebarItem {
  id: string;
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  description: string;
  permission: Permission;
  badge?: string | number;
  isNew?: boolean;
}

export interface SidebarGroup {
  id: string;
  label: string;
  items: SidebarItem[];
  icon?: React.ComponentType<any>;
}

// Cấu hình sidebar với nhóm và phân quyền
const sidebarConfig: SidebarGroup[] = [
  {
    id: 'system',
    label: 'Hệ thống Quản lý',
    icon: Home,
    items: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        href: '/admin',
        icon: Home,
        description: 'Tổng quan hệ thống và thống kê nhanh',
        permission: 'dashboard'
      }
    ]
  },
  {
    id: 'theaters-system',
    label: 'Hệ thống Rạp',
    icon: Building,
    items: [
      {
        id: 'theaters',
        title: 'Rạp chiếu',
        href: '/admin/theaters',
        icon: Building,
        description: 'Quản lý thông tin rạp chiếu phim',
        permission: 'theaters'
      },
      {
        id: 'rooms',
        title: 'Phòng chiếu',
        href: '/admin/rooms',
        icon: Monitor,
        description: 'Quản lý phòng chiếu và cấu hình',
        permission: 'rooms'
      },
      {
        id: 'seats',
        title: 'Sơ đồ ghế',
        href: '/admin/seats',
        icon: Monitor,
        description: 'Thiết kế và quản lý sơ đồ ghế',
        permission: 'seats'
      }
    ]
  },
  {
    id: 'movies-shows',
    label: 'Phim & Xuất Chiếu',
    icon: Film,
    items: [
      {
        id: 'movies',
        title: 'Quản lý phim',
        href: '/admin/movies',
        icon: Film,
        description: 'Thêm, sửa, xóa thông tin phim',
        permission: 'movies'
      },
      {
        id: 'schedules',
        title: 'Lịch chiếu',
        href: '/admin/schedules',
        icon: Calendar,
        description: 'Lập lịch chiếu phim theo rạp',
        permission: 'schedules'
      },
      {
        id: 'bookings',
        title: 'Quản lý vé',
        href: '/admin/bookings',
        icon: Ticket,
        description: 'Xử lý đặt vé và quản lý bán vé',
        permission: 'bookings'
      }
    ]
  },
  {
    id: 'services',
    label: 'Dịch vụ & Ưu đãi',
    icon: Percent,
    items: [
      {
        id: 'combos',
        title: 'Combos',
        href: '/admin/combos',
        icon: Monitor,
        description: 'Quản lý combo đồ ăn, nước uống',
        permission: 'combos',
        isNew: true
      },
      {
        id: 'promotions',
        title: 'Khuyến mãi',
        href: '/admin/promotions',
        icon: Percent,
        description: 'Tạo và quản lý chương trình khuyến mãi',
        permission: 'promotions'
      },
      {
        id: 'content',
        title: 'Nội dung',
        href: '/admin/content',
        icon: MessageSquare,
        description: 'Quản lý nội dung website và ứng dụng',
        permission: 'content'
      }
    ]
  },
  {
    id: 'users-management',
    label: 'Quản lý Người dùng',
    icon: Users,
    items: [
      {
        id: 'customers',
        title: 'Khách hàng',
        href: '/admin/customers',
        icon: Users,
        description: 'Quản lý thông tin khách hàng',
        permission: 'customers'
      },
      {
        id: 'members',
        title: 'Thành viên',
        href: '/admin/members',
        icon: Users,
        description: 'Quản lý tài khoản thành viên VIP',
        permission: 'members'
      },
      {
        id: 'staff',
        title: 'Nhân viên',
        href: '/admin/staff',
        icon: UserCheck,
        description: 'Quản lý nhân viên và ca làm việc',
        permission: 'staff'
      }
    ]
  },
  {
    id: 'reports-analytics',
    label: 'Báo cáo & Phân tích',
    icon: BarChart3,
    items: [
      {
        id: 'reports',
        title: 'Báo cáo & Thống kê',
        href: '/admin/reports',
        icon: BarChart3,
        description: 'Doanh thu, báo cáo kinh doanh chi tiết',
        permission: 'reports'
      }
    ]
  },
  {
    id: 'system-admin',
    label: 'Quản trị Hệ thống',
    icon: Shield,
    items: [
      {
        id: 'permissions',
        title: 'Phân quyền',
        href: '/admin/permissions',
        icon: Shield,
        description: 'Quản lý quyền truy cập và vai trò',
        permission: 'permissions'
      },
      {
        id: 'maintenance',
        title: 'Bảo trì hệ thống',
        href: '/admin/maintenance',
        icon: Database,
        description: 'Bảo trì, backup và xử lý lỗi',
        permission: 'maintenance'
      },
      {
        id: 'settings',
        title: 'Cài đặt',
        href: '/admin/settings',
        icon: Settings,
        description: 'Cấu hình tham số hệ thống',
        permission: 'settings'
      },
      {
        id: 'support',
        title: 'Hỗ trợ',
        href: '/admin/support',
        icon: MessageSquare,
        description: 'Xử lý yêu cầu và hỗ trợ khách hàng',
        permission: 'support'
      }
    ]
  }
];

interface AdminSidebarProps {
  pathname: string;
  userRole?: UserRole; // Thay đổi từ userPermissions sang userRole
  onLogout?: () => void;
}

export function AdminSidebar({
  pathname,
  userRole = 'general_manager', // Mặc định là nhân viên quầy
  onLogout
}: AdminSidebarProps) {
  // Tìm group chứa trang hiện tại
  const findActiveGroup = (): string | null => {
    for (const group of sidebarConfig) {
      const hasActiveItem = group.items.some(item => pathname === item.href);
      if (hasActiveItem) {
        return group.id;
      }
    }
    return null;
  };

  // State để quản lý việc thu gọn/mở rộng các group
  // Mặc định đóng tất cả, chỉ mở group chứa trang hiện tại
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() => {
    const activeGroupId = findActiveGroup();
    const allGroupIds = new Set(sidebarConfig.map(group => group.id));

    // Nếu có group active, loại bỏ nó khỏi danh sách collapsed
    if (activeGroupId) {
      allGroupIds.delete(activeGroupId);
    }

    return allGroupIds;
  });

  // Hàm kiểm tra quyền truy cập dựa trên vai trò
  const { permissions } = useAdminSidebar(userRole);

  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };

  // Hàm toggle collapse group
  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  // Tự động mở group khi pathname thay đổi
  React.useEffect(() => {
    const activeGroupId = findActiveGroup();
    if (activeGroupId) {
      setCollapsedGroups(prev => {
        const newSet = new Set(prev);
        newSet.delete(activeGroupId);
        return newSet;
      });
    }
  }, [pathname]);

  // Lọc các group và item theo quyền
  const visibleGroups = sidebarConfig
    .map(group => ({
      ...group,
      items: group.items.filter(item => hasPermission(item.permission))
    }))
    .filter(group => group.items.length > 0);

  return (
    <Sidebar className="border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarHeader className="border-b border-border/40 p-4">
        <Logo />
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">Admin Panel</span>
            <span className="text-xs text-muted-foreground">
              {useAdminSidebar(userRole).getRoleName()}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {visibleGroups.map((group) => {
          const isCollapsed = collapsedGroups.has(group.id);
          const GroupIcon = group.icon;

          return (
            <SidebarGroup key={group.id}>
              <SidebarGroupLabel
                className="flex items-center justify-between px-2 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors group"
                onClick={() => toggleGroup(group.id)}
              >
                <div className="flex items-center gap-2">
                  {GroupIcon && <GroupIcon className="h-4 w-4" />}
                  <span>{group.label}</span>
                </div>
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:scale-110" />
                ) : (
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:scale-110" />
                )}
              </SidebarGroupLabel>

              {!isCollapsed && (
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;

                      return (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            tooltip={item.description}
                            className={cn(
                              "group relative h-10 px-3 py-2 rounded-lg transition-all duration-200",
                              "hover:bg-accent/50 hover:text-accent-foreground",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                              isActive && "bg-primary/10 text-primary font-medium shadow-sm"
                            )}
                          >
                            <Link href={item.href} className="flex items-center gap-3 w-full">
                              <Icon className={cn(
                                "h-5 w-5 flex-shrink-0 transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                              )} />
                              <span className="text-sm truncate">{item.title}</span>

                              {/* Badge cho mục mới hoặc số lượng */}
                              {item.isNew && (
                                <span className="ml-auto bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                                  Mới
                                </span>
                              )}
                              {item.badge && (
                                <span className="ml-auto bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full font-medium">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onLogout}
              className="h-10 px-3 py-2 text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors rounded-lg"
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-2">Đăng xuất</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

// Hook để sử dụng với hệ thống phân quyền - chỉ 3 role
export const useAdminSidebar = (userRole: UserRole) => {
  // Mapping vai trò với quyền truy cập
  const rolePermissions: Record<UserRole, Permission[]> = {
    // Quản lý tổng - toàn quyền
    'general_manager': [
      'dashboard', 'movies', 'schedules', 'rooms', 'seats', 'combos',
      'bookings', 'members', 'staff', 'theaters', 'customers', 'promotions',
      'reports', 'content', 'maintenance', 'permissions', 'support', 'settings'
    ],

    // Quản lý rạp - quản lý vận hành rạp
    'cinema_manager': [
      'dashboard', 'movies', 'schedules', 'rooms', 'seats', 'combos',
      'bookings', 'customers', 'staff', 'reports', 'content', 'support'
    ],

    // Quản lý quầy - chỉ bán vé và phục vụ khách hàng
    'counter_staff': [
      'dashboard', 'bookings', 'customers', 'combos', 'support'
    ]
  };

  return {
    permissions: rolePermissions[userRole] || [],
    hasPermission: (permission: Permission) =>
      rolePermissions[userRole]?.includes(permission) || false,
    getRoleName: () => {
      const roleNames = {
        'general_manager': 'Quản lý tổng',
        'cinema_manager': 'Quản lý rạp',
        'counter_staff': 'Quản lý quầy'
      };
      return roleNames[userRole];
    }
  };
};