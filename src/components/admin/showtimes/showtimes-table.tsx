import { Showtimes } from "@/types/showtimes";
import { Clock, Edit, Eye, X } from "lucide-react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ErrorComponent from "@/components/ui/error";
import { TableSkeletonLoader } from "@/components/ui/table-skeleton-loader";
import { formatDateTime } from "@/utils/date";

interface ShowtimesTableProps {
    showtimes?: Showtimes[];
    isFetching: boolean;
    isError: boolean;
     error: string | null | undefined;
    onEdit: (showtime: Showtimes) => void;
    onCancel: (showtime: Showtimes) => void;
    onDetail: (showtime: Showtimes) => void;
}

export const ShowtimesTable: React.FC<ShowtimesTableProps> = ({
    showtimes,
    isFetching,
    isError,
    error,
    onEdit,
    onCancel,
    onDetail,
}) => {
    const getStatusVi = (status: string): string => {
        switch (status) {
            case "active":
                return "Đang hoạt động";
            case "canceled":
                return "Đã hủy";
            case "ended":
                return "Đã kết thúc";
            default:
                return status;
        }
    };

    return (
        <div className="rounded-lg border bg-card shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Mã lịch chiếu</TableHead>
                        <TableHead>Phim</TableHead>
                        <TableHead>Ngày giờ chiếu</TableHead>
                        <TableHead>Phòng / Rạp</TableHead>
                        <TableHead>Định dạng</TableHead>
                        <TableHead>Giá vé</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ngôn ngữ</TableHead>
                        <TableHead>Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        isError ? (
                            <TableRow>
                                <TableCell colSpan={9}>
                                    <ErrorComponent error={error} />
                                </TableCell>
                            </TableRow>
                        )
                            : isFetching ? (
                                <TableSkeletonLoader
                                    rowCount={6}
                                    columns={[
                                        { width: 'w-12', height: 'h-12', shape: 'rounded-md', cellClassName: 'py-2 px-4' },
                                        { width: 'w-48', height: 'h-6', shape: 'rounded-md', cellClassName: 'py-2 px-4' },
                                        { width: 'w-32', height: 'h-6', shape: 'rounded-md', cellClassName: 'hidden sm:table-cell py-2 px-4' },
                                        { width: 'w-48', height: 'h-6', shape: 'rounded-md', cellClassName: 'hidden md:table-cell py-2 px-4' },
                                        { width: 'w-32', height: 'h-6', shape: 'rounded-md', cellClassName: 'hidden lg:table-cell py-2 px-4' },
                                        { width: 'w-24', height: 'h-6', shape: 'rounded-md', cellClassName: 'py-2 px-4' },
                                        { width: 'w-32', height: 'h-6', shape: 'rounded-md', cellClassName: 'hidden sm:table-cell py-2 px-4' },
                                        { width: 'w-24', height: 'h-6', shape: 'rounded-md', cellClassName: 'hidden md:table-cell py-2 px-4' },
                                        { width: 'w-16', height: 'h-6', shape: 'rounded-md', cellClassName: 'py-6 px-4' },
                                    ]}
                                />

                            ) : (
                                showtimes?.map((showtime) => (
                                    <TableRow key={showtime.showtime_id}>
                                        <TableCell className="font-medium">
                                            {showtime.showtime_id}
                                        </TableCell>
                                        <TableCell>{showtime.movie.title}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                                                {formatDateTime(showtime.show_datetime)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <span className="font-medium truncate max-w-[200px]">
                                                    {showtime.room.room_name} / Theater {showtime.theater.name}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant="outline">{showtime.format}</Badge>
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            {showtime.ticket_price}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    showtime.status === "active"
                                                        ? "default"
                                                        : showtime.status === "canceled"
                                                            ? "destructive"
                                                            : "secondary"
                                                }
                                            >
                                                {getStatusVi(showtime.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{showtime.language}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onDetail(showtime)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onEdit(showtime)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onCancel(showtime)}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )
                    }
                </TableBody>
            </Table>
        </div>
    );
};
