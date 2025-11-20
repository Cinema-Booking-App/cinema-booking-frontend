import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer, CheckCircle, Info } from "lucide-react";
import { Booking } from '@/types/bookings';

interface BookingTableProps {
  isLoading: boolean;
  results: Booking[];
  onPrint: (b: Booking) => void;
  onReceive: (b: Booking) => void;
  onSelect: (b: Booking) => void;
}

const BookingTable: React.FC<BookingTableProps> = ({ isLoading, results, onPrint, onReceive, onSelect }) => (
  <div className="bg-white dark:bg-slate-900 rounded-lg shadow mb-6">
    <div className="p-0 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã đặt vé</TableHead>
            <TableHead>Khách hàng</TableHead>
            <TableHead>Phim</TableHead>
            <TableHead>Suất chiếu</TableHead>
            <TableHead>Ghế</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>In vé</TableHead>
            <TableHead>Nhận vé</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(!isLoading && results.length === 0) && (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                Không có dữ liệu. Hãy nhập thông tin để tra cứu.
              </TableCell>
            </TableRow>
          )}
          {results.map(b => (
            <TableRow key={b.code} className="hover:bg-accent/30">
              <TableCell>
                <button className="text-primary underline" onClick={() => onSelect(b)}>
                  {b.code}
                </button>
              </TableCell>
              <TableCell>{b.customer}</TableCell>
              <TableCell>{b.movie}</TableCell>
              <TableCell>{b.showtime}</TableCell>
              <TableCell>{b.seats}</TableCell>
              <TableCell>
                <span className={b.status === 'Đã thanh toán' ? 'text-green-600' : b.status === 'Đã hoàn vé' ? 'text-red-600' : 'text-yellow-600'}>
                  {b.status}
                </span>
              </TableCell>
              <TableCell>
                <Button size="sm" variant={b.printed ? "default" : "outline"} onClick={() => onPrint(b)} disabled={b.printed}>
                  <Printer className="w-4 h-4 mr-1" /> {b.printed ? "Đã in" : "In vé"}
                </Button>
              </TableCell>
              <TableCell>
                <Button size="sm" variant={b.received ? "default" : "outline"} onClick={() => onReceive(b)} disabled={b.received || !b.printed}>
                  <CheckCircle className="w-4 h-4 mr-1" /> {b.received ? "Đã nhận" : "Nhận vé"}
                </Button>
              </TableCell>
              <TableCell>
                <Button size="sm" variant="outline" onClick={() => onSelect(b)}>
                  <Info className="w-4 h-4 mr-1" /> Chi tiết
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

export default BookingTable;
