"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PaymentHeaderProps {
  backUrl?: string;
}

export default function PaymentHeader({ backUrl = "/booking/1" }: PaymentHeaderProps) {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href={backUrl}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 p-2 sm:px-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Quay lại</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Thanh toán
            </h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Hoàn tất đặt vé của bạn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}