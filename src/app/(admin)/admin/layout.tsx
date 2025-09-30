"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/client/theme-toggle";
import { Scan } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Hàm xử lý khi click vào icon quét mã (ví dụ)
  const handleScanClick = () => {
    alert("Kích hoạt chức năng quét mã!");
    // Logic của bạn để mở camera hoặc trang quét mã
  };
  return (
    <SidebarProvider>
      <AdminSidebar pathname={pathname} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="fixed top-0   w-full items-center justify-between px-4 py-2 bg-background z-50 ">
            <SidebarTrigger className="-ml-1" />
            <ThemeToggle  />
            <button
              onClick={handleScanClick}
              className="text-muted-foreground hover:text-foreground p-2 rounded-md" 
            >
              <Scan className="h-4 w-4" />
   
            </button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 