"use client";
import React from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen">
      <AdminSidebar pathname={pathname} />
      <main className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Không tìm thấy trang</h1>
        <p className="text-muted-foreground mb-8">Trang bạn truy cập không tồn tại hoặc đã bị xóa.</p>
        <a href="/admin" className="text-primary underline">Quay về trang quản trị</a>
      </main>
    </div>
  );
}
