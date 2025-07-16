"use client";

import Link from "next/link";
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
  MessageSquare
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
import Logo from "../client/layouts/header/logo";

// Danh sách các mục sidebar cho trang admin, mỗi mục gồm tiêu đề, đường dẫn, icon và mô tả
const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
    description: "Tổng quan hệ thống"
  },
  {
    title: "Quản lý phim",
    href: "/admin/movies",
    icon: Film,
    description: "Thêm, sửa, xóa thông tin phim"
  },
  {
    title: "Lịch chiếu",
    href: "/admin/schedules",
    icon: Calendar,
    description: "Quản lý lịch chiếu phim"
  },
  {
    title: "Phòng chiếu",
    href: "/admin/rooms",
    icon: Building,
    description: "Quản lý phòng chiếu và sơ đồ ghế"
  },
  {
    title: "Sơ đồ ghế",
    href: "/admin/seats",
    icon: Monitor,
    description: "Quản lý sơ đồ ghế cho các phòng chiếu"
  },
  {
    title: "Quản lý vé",
    href: "/admin/bookings",
    icon: Ticket,
    description: "Xử lý đặt vé và quản lý giá vé"
  },
  {
    title: "Thành viên",
    href: "/admin/members",
    icon: Users,
    description: "Quản lý tài khoản thành viên"
  },
  {
    title: "Nhân viên",
    href: "/admin/staff",
    icon: UserCheck,
    description: "Quản lý nhân viên và phân quyền"
  },
  {
    title: "Rạp chiếu",
    href: "/admin/cinemas",
    icon: Building,
    description: "Quản lý thông tin rạp chiếu"
  },
  {
    title: "Khách hàng",
    href: "/admin/customers",
    icon: Users,
    description: "Quản lý thông tin khách hàng"
  },
  {
    title: "Khuyến mãi",
    href: "/admin/promotions",
    icon: Percent,
    description: "Quản lý chương trình khuyến mãi"
  },
  {
    title: "Báo cáo & Thống kê",
    href: "/admin/reports",
    icon: BarChart3,
    description: "Doanh thu và báo cáo kinh doanh"
  },
  {
    title: "Nội dung",
    href: "/admin/content",
    icon: Monitor,
    description: "Quản lý nội dung website"
  },
  {
    title: "Bảo trì hệ thống",
    href: "/admin/maintenance",
    icon: Database,
    description: "Bảo trì và xử lý lỗi"
  },
  {
    title: "Phân quyền",
    href: "/admin/permissions",
    icon: Shield,
    description: "Quản lý quyền truy cập"
  },
  {
    title: "Hỗ trợ",
    href: "/admin/support",
    icon: MessageSquare,
    description: "Xử lý yêu cầu khách hàng"
  },
  {
    title: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
    description: "Cấu hình hệ thống"
  },
];

// Component Sidebar chính cho trang Admin
export function AdminSidebar({ pathname }: { pathname: string }) {
  return (
    // Sidebar tổng thể
    <Sidebar>
      {/* Header của sidebar, chứa logo hoặc tiêu đề */}
      <SidebarHeader>
        <Logo/>
      </SidebarHeader>
      <SidebarContent>
        {/* Nhóm 1: Quản lý chính */}
        <SidebarGroup>
          <SidebarGroupLabel>Quản lý chính</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Lặp qua các mục thuộc nhóm 1 */}
              {sidebarItems.slice(0, 5).map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    {/* Nút menu, có tooltip và trạng thái active */}
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.description}>
                      <Link href={item.href} className="text">
                        <Icon className="h-8 w-8 text-chart-3" />
                        <span className="ml-2 text-md">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Nhóm 2: Quản lý người dùng */}
        <SidebarGroup>
          <SidebarGroupLabel>Quản lý người dùng</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Lặp qua các mục thuộc nhóm 2 */}
              {sidebarItems.slice(5, 9).map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.description}>
                      <Link href={item.href}>
                        <Icon className="h-8 w-8 text-chart-3" />
                        <span className="ml-2 text-md">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Nhóm 3: Hệ thống */}
        <SidebarGroup>
          <SidebarGroupLabel>Hệ thống</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Lặp qua các mục thuộc nhóm 3 */}
              {sidebarItems.slice(9).map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.description}>
                      <Link href={item.href}>
                        <Icon className="h-8 w-8 text-chart-3" />
                        <span className="ml-2 text-md">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* Footer của sidebar, chứa nút đăng xuất */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <LogOut className="h-4 w-4 text-destructive" />
              Đăng xuất
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
} 