"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { CustomerData } from "./types";

interface CustomerInfoProps {
  data?: CustomerData;
  onDataChange?: (data: CustomerData) => void;
}

export default function CustomerInfo({ data, onDataChange }: CustomerInfoProps) {
  const handleInputChange = (field: keyof CustomerData, value: string) => {
    // Notify parent with updated data
    if (onDataChange) {
      onDataChange({
        fullName: field === 'fullName' ? value : data?.fullName || '',
        phone: field === 'phone' ? value : data?.phone || '',
        email: field === 'email' ? value : data?.email || '',
        idNumber: field === 'idNumber' ? value : data?.idNumber || '',
      });
    }
  };

  return (
    <Card className="p-4 sm:p-6 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
        <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
        Thông tin khách hàng
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium">
            Họ và tên <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="fullName" 
            placeholder="Nhập họ và tên" 
            className="h-10 sm:h-11"
            value={data?.fullName || ''}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Số điện thoại <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="phone" 
            placeholder="Nhập số điện thoại" 
            type="tel"
            className="h-10 sm:h-11"
            value={data?.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="email" 
            placeholder="Nhập email" 
            type="email"
            className="h-10 sm:h-11"
            value={data?.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="idNumber" className="text-sm font-medium">
            CMND/CCCD
          </Label>
          <Input 
            id="idNumber" 
            placeholder="Nhập số CMND/CCCD" 
            className="h-10 sm:h-11"
            value={data?.idNumber || ''}
            onChange={(e) => handleInputChange('idNumber', e.target.value)}
          />
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200">
          <span className="font-medium">Lưu ý:</span> Vui lòng nhập đầy đủ thông tin để nhận vé qua email và liên hệ khi cần thiết.
        </p>
      </div>
    </Card>
  );
}