"use client";

import { useState } from "react";
import { Search, Filter, Calendar, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface BookingFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  ticketStatusFilter: string;
  onTicketStatusFilterChange: (value: string) => void;
}

export function BookingFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  ticketStatusFilter,
  onTicketStatusFilterChange
}: BookingFiltersProps) {
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: "",
    cinema: "",
    movieType: "",
    priceRange: "",
    showPromotions: false,
    showExpired: false
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleAdvancedFilterChange = (key: string, value: string | boolean) => {
    setAdvancedFilters(prev => ({ ...prev, [key]: value }));
    
    // Update active filters for UI display
    if (value && typeof value === 'string') {
      setActiveFilters(prev => [...prev.filter(f => !f.startsWith(key)), `${key}:${value}`]);
    } else if (!value) {
      setActiveFilters(prev => prev.filter(f => !f.startsWith(key)));
    }
  };

  const clearAllFilters = () => {
    setAdvancedFilters({
      dateRange: "",
      cinema: "",
      movieType: "",
      priceRange: "",
      showPromotions: false,
      showExpired: false
    });
    setActiveFilters([]);
  };

  const removeFilter = (filter: string) => {
    const [key] = filter.split(':');
    setAdvancedFilters(prev => ({ ...prev, [key]: "" }));
    setActiveFilters(prev => prev.filter(f => f !== filter));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Bộ lọc và tìm kiếm
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Bộ lọc đang áp dụng:</span>
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="gap-1">
                {filter.split(':')[1]}
                <button
                  onClick={() => removeFilter(filter)}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-6 px-2 text-xs"
            >
              Xóa tất cả
            </Button>
          </div>
        )}

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo mã vé, tên phim, khách hàng..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Trạng thái thanh toán" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="paid">Đã thanh toán</SelectItem>
              <SelectItem value="pending">Đang chờ</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ticketStatusFilter} onValueChange={onTicketStatusFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Trạng thái vé" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="unused">Chưa sử dụng</SelectItem>
              <SelectItem value="used">Đã sử dụng</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc nâng cao
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Bộ lọc nâng cao</SheetTitle>
                <SheetDescription>
                  Tùy chỉnh bộ lọc để tìm kiếm vé chính xác hơn
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                {/* Date Range */}
                <div className="space-y-2">
                  <Label>Khoảng thời gian</Label>
                  <Select 
                    value={advancedFilters.dateRange} 
                    onValueChange={(value) => handleAdvancedFilterChange('dateRange', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khoảng thời gian" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Hôm nay</SelectItem>
                      <SelectItem value="tomorrow">Ngày mai</SelectItem>
                      <SelectItem value="this-week">Tuần này</SelectItem>
                      <SelectItem value="next-week">Tuần tới</SelectItem>
                      <SelectItem value="this-month">Tháng này</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Cinema */}
                <div className="space-y-2">
                  <Label>Rạp chiếu</Label>
                  <Select 
                    value={advancedFilters.cinema} 
                    onValueChange={(value) => handleAdvancedFilterChange('cinema', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn rạp chiếu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cgv">CGV</SelectItem>
                      <SelectItem value="lotte">Lotte Cinema</SelectItem>
                      <SelectItem value="bhd">BHD Star</SelectItem>
                      <SelectItem value="galaxy">Galaxy Cinema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Movie Type */}
                <div className="space-y-2">
                  <Label>Loại phim</Label>
                  <Select 
                    value={advancedFilters.movieType} 
                    onValueChange={(value) => handleAdvancedFilterChange('movieType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại phim" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="action">Hành động</SelectItem>
                      <SelectItem value="comedy">Hài</SelectItem>
                      <SelectItem value="drama">Tâm lý</SelectItem>
                      <SelectItem value="horror">Kinh dị</SelectItem>
                      <SelectItem value="romance">Tình cảm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Price Range */}
                <div className="space-y-2">
                  <Label>Khoảng giá</Label>
                  <Select 
                    value={advancedFilters.priceRange} 
                    onValueChange={(value) => handleAdvancedFilterChange('priceRange', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khoảng giá" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-50000">Dưới 50,000đ</SelectItem>
                      <SelectItem value="50000-100000">50,000đ - 100,000đ</SelectItem>
                      <SelectItem value="100000-150000">100,000đ - 150,000đ</SelectItem>
                      <SelectItem value="150000+">Trên 150,000đ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="promotions" 
                      checked={advancedFilters.showPromotions}
                      onCheckedChange={(checked) => 
                        handleAdvancedFilterChange('showPromotions', checked as boolean)
                      }
                    />
                    <Label htmlFor="promotions">Chỉ hiển thị vé có khuyến mãi</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="expired" 
                      checked={advancedFilters.showExpired}
                      onCheckedChange={(checked) => 
                        handleAdvancedFilterChange('showExpired', checked as boolean)
                      }
                    />
                    <Label htmlFor="expired">Bao gồm vé đã hết hạn</Label>
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={clearAllFilters}
                    className="flex-1"
                  >
                    Xóa tất cả
                  </Button>
                  <Button className="flex-1">
                    Áp dụng bộ lọc
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </CardContent>
    </Card>
  );
} 