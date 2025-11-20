import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, ChevronDown, Search, QrCode, RefreshCw } from "lucide-react";

const statusOptions = [
  { value: "all", label: "Tất cả" },
  { value: "Đã thanh toán", label: "Đã thanh toán" },
  { value: "Chưa thanh toán", label: "Chưa thanh toán" },
  { value: "Đã hoàn vé", label: "Đã hoàn vé" },
];

interface FilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  dateFilter: string;
  setDateFilter: (v: string) => void;
  showFilter: boolean;
  setShowFilter: (v: boolean | ((v: boolean) => boolean)) => void;
  onSearch: () => void;
  onScanQR: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  showFilter,
  setShowFilter,
  onSearch,
  onScanQR,
}) => (
  <div className="mb-6">
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-4 flex flex-col sm:flex-row gap-4 items-center">
      <Input
        placeholder="Nhập mã đặt vé, SĐT, email hoặc tên khách..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="flex-1"
        onKeyDown={e => e.key === 'Enter' && onSearch()}
      />
      <Button onClick={() => setShowFilter(v => !v)} variant="outline" className="h-10 flex gap-2 items-center">
        <Filter className="w-4 h-4" />
        Bộ lọc
        <ChevronDown className={showFilter ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </Button>
      <Button onClick={onSearch} className="h-10 px-6 flex gap-2 items-center">
        <Search className="w-4 h-4" />
        Tra cứu
      </Button>
      <Button onClick={onScanQR} variant="outline" className="h-10 flex gap-2 items-center">
        <QrCode className="w-4 h-4" />
        Quét QR
      </Button>
      <Button onClick={() => window.location.reload()} variant="ghost" className="h-10 flex gap-2 items-center">
        <RefreshCw className="w-4 h-4" />
      </Button>
    </div>
    {showFilter && (
      <div className="px-4 pb-4 flex flex-col sm:flex-row gap-4 items-center animate-fade-in">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Trạng thái:</span>
          <select
            className="border rounded px-2 py-1"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Ngày chiếu:</span>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          />
        </div>
      </div>
    )}
  </div>
);

export default FilterBar;
