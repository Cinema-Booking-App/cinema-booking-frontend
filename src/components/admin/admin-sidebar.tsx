"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
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
import Logo from "../client/layouts/header/logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useGetCurrentUserQuery, useLogoutMutation } from "@/store/slices/auth/authApi";
import { useRouter } from 'next/navigation';
import { UserCurrent } from "@/types/user";
// Types cho sidebar
export interface SidebarItem {
  id: string;
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  permission: string; // Tên permission từ DB
  badge?: string | number;
  isNew?: boolean;
}

export interface SidebarGroup {
  id: string;
  label: string;
  items: SidebarItem[];
  icon?: React.ComponentType<{ className?: string }>;
}

// Cấu hình sidebar - permission name từ DB
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
      },
      {
        id: 'counter',
        title: 'Quầy nhân viên',
        href: '/admin/counter',
        icon: UserCheck,
        description: 'Tra cứu, in vé, xác nhận vé tại quầy',
        permission: 'counter',
        isNew: true
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
      // {
      //   id: 'rooms',
      //   title: 'Phòng chiếu',
      //   href: '/admin/rooms',
      //   icon: Monitor,
      //   description: 'Quản lý phòng chiếu và cấu hình',
      //   permission: 'rooms'
      // },
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
        id: 'showtimes',
        title: 'Lịch chiếu',
        href: '/admin/showtimes',
        icon: Calendar,
        description: 'Lập lịch chiếu phim theo rạp',
        permission: 'showtimes'
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
        id: 'ranks',
        title: 'Thẻ thành viên',
        href: '/admin/ranks',
        icon: MessageSquare,
        description: 'Quản lý cấp bậc thẻ thành viên',
        permission: 'ranks'
      }
    ]
  },
  {
    id: 'users-management',
    label: 'Quản lý Người dùng',
    icon: Users,
    items: [
      {
        id: 'users',
        title: 'Khách hàng',
        href: '/admin/users',
        icon: Users,
        description: 'Quản lý thông tin khách hàng',
        permission: 'users'
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
      ,
      {
        id: 'transactions',
        title: 'Quản lý giao dịch',
        href: '/admin/transactions',
        icon: Database,
        description: 'Kiểm tra, xử lý các giao dịch thanh toán',
        permission: 'transactions'
      },
      {
        id: 'payments',
        title: 'Quản lý thanh toán',
        href: '/admin/payments',
        icon: Settings,
        description: 'Theo dõi, xác nhận và đối soát thanh toán',
        permission: 'payments'
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
  onLogout?: () => void;
}

export function AdminSidebar({ pathname, onLogout }: AdminSidebarProps) {
  const {data :user } = useGetCurrentUserQuery();

  const [logoutMutation] = useLogoutMutation();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);

  // Lấy thông tin user và permissions khi component mount
  useEffect(() => {
    if (user) {
      const allPermissions = user.roles.flatMap(role =>
        role.permissions?.map(permission => permission.permission_name)
      );
      setUserPermissions([...new Set(allPermissions.filter((p): p is string => typeof p === 'string'))]);
    }
    setLoading(false);
  }, [user]);

  // Permission checking function
  const hasPermission = (permissionName: string): boolean => {
    if (!user) return false;

    // Super admin (role_name = 'super_admin') có toàn quyền
    try {
      const isSuperAdmin = user.roles?.some((role: any) => (role?.role_name || '').toLowerCase() === 'super_admin');
      if (isSuperAdmin) return true;
    } catch (e) {
      // ignore and fallback to permission list
    }

    return userPermissions.includes(permissionName);
  };

  // Tìm group chứa trang hiện tại
  const findActiveGroup = React.useCallback((): string | null => {
    for (const group of sidebarConfig) {
      const hasActiveItem = group.items.some(item => pathname === item.href);
      if (hasActiveItem) {
        return group.id;
      }
    }
    return null;
  }, [pathname]);

  // State để quản lý việc thu gọn/mở rộng các group
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() => {
    const activeGroupId = findActiveGroup();
    const allGroupIds = new Set(sidebarConfig.map(group => group.id));

    if (activeGroupId) {
      allGroupIds.delete(activeGroupId);
    }

    return allGroupIds;
  });

  // Toggle group function
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
  useEffect(() => {
    const activeGroupId = findActiveGroup();
    if (activeGroupId) {
      setCollapsedGroups(prev => {
        const newSet = new Set(prev);
        newSet.delete(activeGroupId);
        return newSet;
      });
    }
  }, [pathname, findActiveGroup]);

  // Filter sidebar based on permissions
  const visibleGroups = sidebarConfig
    .map(group => ({
      ...group,
      items: group.items.filter(item => hasPermission(item.permission))
    }))
    .filter(group => group.items.length > 0);

  // Get primary role name for display
  const getPrimaryRoleName = (): string => {
    if (!user || !user.roles.length) return 'Không xác định';

    // Ưu tiên hiển thị role quan trọng nhất
    const roleOrder = ['super_admin', 'theater_admin', 'theater_manager', 'booking_staff', 'report_staff'];

    for (const roleName of roleOrder) {
      const role = user.roles.find(r => r.role_name === roleName);
      if (role) {
        const roleNameMap: Record<string, string> = {
          'super_admin': 'Quản trị viên',
          'theater_admin': 'Quản lý rạp',
          'theater_manager': 'Trưởng ca',
          'booking_staff': 'Nhân viên bán vé',
          'report_staff': 'Nhân viên báo cáo'
        };
        return roleNameMap[roleName] || role.description;
      }
    }

    return user.roles[0].description;
  };

  // Loading state
  if (loading) {
    return (
      <Sidebar className="border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <SidebarHeader className="border-b border-border/40 p-4">
          <Logo />
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded-md"></div>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-2 py-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  // No user state
  // if (!user) {
  //   return (
  //     <Sidebar className="border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  //       <SidebarHeader className="border-b border-border/40 p-4">
  //         <Logo />
  //         <div className="text-center text-muted-foreground">
  //           Không thể tải thông tin người dùng
  //         </div>
  //       </SidebarHeader>
  //     </Sidebar>
  //   );
  // }

  return (
    <Sidebar className="border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarHeader className="border-b border-border/40 p-4">
        <Logo />
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={user?.full_name || "https://github.com/shadcn.png"}
              alt={user?.full_name}
            />
            <AvatarFallback>
              {user?.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              {user?.full_name}
            </span>
            <span className="text-xs text-muted-foreground">
              {getPrimaryRoleName()}
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
              onClick={async () => {
                // If parent provided a handler, prefer it (e.g., NotFound passes a logout handler).
                if (onLogout) {
                  try { onLogout(); } catch (e) { /* ignore */ }
                  return;
                }

                // Otherwise call the auth API logout mutation which dispatches client-side logout
                try {
                  await logoutMutation().unwrap();
                } catch (e) {
                  // ignore network errors; mutation will still clear client state in onQueryStarted
                } finally {
                  router.push('/login');
                }
              }}
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

