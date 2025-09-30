// src/app/(admin)/admin/theaters/components/TheaterForm.tsx
"use client";

import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAddTheaterMutation, useGetProvinceInApiQuery } from "@/store/slices/theaters/theatersApi";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

// Định nghĩa kiểu dữ liệu cho form
interface CreateTheater {
  name: string;
  address: string;
  city: string;
  phone: string;
}

// Component form để thêm rạp phim
const TheaterForm: React.FC = () => {
  const [open, setOpen] = useState(false);

  // Khởi tạo React Hook Form
  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting },} = useForm<CreateTheater>({
    defaultValues: {
      name: "",
      address: "",
      city: "",
      phone: "",
    },
  });

  // Sử dụng hook RTK Query để lấy danh sách tỉnh/thành phố
  const { data: cities, isLoading, isError } = useGetProvinceInApiQuery();
  const [addTheater] = useAddTheaterMutation()
  // Hàm xử lý khi form hợp lệ
  const onSubmit: SubmitHandler<CreateTheater> = async (data) => {
    console.log("Dữ liệu form đã gửi:", data);
    await addTheater(data).unwrap()
    await new Promise(resolve => setTimeout(resolve, 1000));
    reset();
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Tên Rạp */}
      <div className="space-y-2">
        <Label htmlFor="name">Tên Rạp *</Label>
        <Input
          id="name"
          placeholder="Tên rạp chiếu phim"
          {...register("name", { required: "Tên rạp là bắt buộc." })}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      {/* Địa chỉ */}
      <div className="space-y-2">
        <Label htmlFor="address">Địa chỉ *</Label>
        <Textarea
          id="address"
          placeholder="Số nhà, đường, phường/xã..."
          {...register("address", { required: "Địa chỉ là bắt buộc." })}
        />
        {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
      </div>

      {/* Thành phố */}
      <div className="space-y-2">
        <Label htmlFor="city">Thành phố *</Label>
        <Controller
          name="city"
          control={control}
          rules={{ required: "Vui lòng chọn một thành phố." }}
          render={({ field }) => (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tải...
                    </>
                  ) : field.value ? (
                    cities?.find((city) => city.name === field.value)?.name
                  ) : (
                    "Chọn thành phố..."
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Tìm kiếm thành phố..." />
                  <CommandList>
                    {isError ? (
                      <CommandEmpty>Lỗi khi tải dữ liệu</CommandEmpty>
                    ) : (
                      <CommandEmpty>Không tìm thấy thành phố.</CommandEmpty>
                    )}
                    <CommandGroup>
                      {cities?.map((city) => (
                        <CommandItem
                          key={city.code}
                          value={city.name}
                          onSelect={(currentValue) => {
                            field.onChange(currentValue === field.value ? "" : currentValue);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === city.name ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {city.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
      </div>

      {/* Số điện thoại */}
      <div className="space-y-2">
        <Label htmlFor="phone">Số điện thoại *</Label>
        <Input
          id="phone"
          placeholder="0xxxxxxxxx"
          {...register("phone", { required: "Số điện thoại là bắt buộc." })}
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
      </div>

      {/* Các nút hành động */}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          disabled={isSubmitting}
        >
          Hủy
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Thêm Rạp
        </Button>
      </div>
    </form>
  );
};

export default TheaterForm;
