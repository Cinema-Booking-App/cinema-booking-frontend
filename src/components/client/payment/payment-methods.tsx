"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { CreditCard, Shield, CheckCircle } from "lucide-react";
import Image from "next/image";

export interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  description: string;
  color: string;
  popular: boolean;
}

interface PaymentMethodsProps {
  methods: PaymentMethod[];
  selectedMethod: string;
  onMethodSelect: (methodId: string) => void;
}

export default function PaymentMethods({ methods, selectedMethod, onMethodSelect }: PaymentMethodsProps) {
  return (
    <Card className="p-3 sm:p-4 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-blue-500" />
        Phương thức thanh toán
      </h2>
      
      <div className="space-y-2 sm:space-y-3">
        {methods.map((method) => (
          <div
            key={method.id}
            className={`relative p-2.5 sm:p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.01] ${
              selectedMethod === method.id
                ? "border-red-500 bg-red-50 dark:bg-red-900/20 shadow-md"
                : "border-gray-200 dark:border-gray-700 hover:border-red-300 hover:shadow-sm bg-white/50 dark:bg-slate-700/50"
            }`}
            onClick={() => onMethodSelect(method.id)}
          >
            {/* Popular Badge */}
            {method.popular && (
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
                HOT
              </div>
            )}
            
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Logo */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white flex items-center justify-center shadow-sm p-0.5 border flex-shrink-0">
                <Image
                  src={method.logo}
                  alt={method.name}
                  width={32}
                  height={32}
                  className="w-full h-full object-contain rounded"
                />
              </div>
              
              {/* Method Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm sm:text-base truncate">{method.name}</p>
                <p className="text-xs text-muted-foreground truncate hidden sm:block">{method.description}</p>
              </div>
              
              {/* Security & Selection */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <Shield className="w-3 h-3 text-green-600" />
                {selectedMethod === method.id && (
                  <CheckCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}