import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import ScheduleActionButtons from "./schedule-action-buttons";

type Schedule = {
  id: string;
  movieName: string;
  datetime: string;
  room: string;
  cinema: string;
  format: string;
  status: string;
  statusVi: string;
};

type SchedulesTableProps = {
  schedules: Schedule[];
  onEdit: (s: Schedule) => void;
  onCancel: (s: Schedule) => void;
  onDetail: (s: Schedule) => void;
};

export default function SchedulesTable({ schedules, onEdit, onCancel, onDetail }: SchedulesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Mã lịch</TableHead>
          <TableHead>Tên phim</TableHead>
          <TableHead>Ngày giờ</TableHead>
          <TableHead>Phòng</TableHead>
          <TableHead>Rạp</TableHead>
          <TableHead>Định dạng</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schedules.map((s) => (
          <TableRow key={s.id}>
            <TableCell>{s.id}</TableCell>
            <TableCell>{s.movieName}</TableCell>
            <TableCell>{s.datetime}</TableCell>
            <TableCell>{s.room}</TableCell>
            <TableCell>{s.cinema}</TableCell>
            <TableCell>{s.format}</TableCell>
            <TableCell className={
              s.status === 'canceled' || s.status === 'postponed'
                ? 'text-red-600 font-semibold'
                : s.status === 'ended'
                ? 'text-gray-400 font-semibold'
                : 'text-green-600 font-semibold'
            }>{s.statusVi}</TableCell>
            <TableCell>
              <ScheduleActionButtons onEdit={() => onEdit(s)} onCancel={() => onCancel(s)} onDetail={() => onDetail(s)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 