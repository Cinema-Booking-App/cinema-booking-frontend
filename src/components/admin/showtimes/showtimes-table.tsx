import { Showtimes } from "@/types/showtimes";
import { Clock, Edit, Eye, X } from "lucide-react";

interface ShowtimesTableProps {
  showtimes?: Showtimes[];
  onEdit: (showtime: Showtimes) => void;
  onCancel: (showtime: Showtimes) => void;
  onDetail: (showtime: Showtimes) => void;
}

export const ShowtimesTable: React.FC<ShowtimesTableProps> = ({ showtimes, onEdit, onCancel, onDetail }) => {
  // Helper function to map status to Vietnamese translation
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
    <div className="bg-background rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Mã lịch chiếu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Phim
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Ngày giờ chiếu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Phòng / Rạp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Định dạng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Giá vé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Ngôn ngữ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-gray-200">
            {showtimes?.map((showtime: Showtimes) => (
              <tr key={showtime.showtime_id} className="hover:bg-background-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                  {showtime.showtime_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  Movie {showtime.movie_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    {showtime.show_datetime}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  <div>
                    <div className="font-medium">Room {showtime.room_id}</div>
                    <div className="text-foreground">Theater {showtime.theater_id}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {showtime.format}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">
                  {showtime.ticket_price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      showtime.status === "active"
                        ? "bg-green-100 text-green-800"
                        : showtime.status === "canceled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-foreground"
                    }`}
                  >
                    {getStatusVi(showtime.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {showtime.language}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onDetail(showtime)}
                      className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(showtime)}
                      className="text-green-600 hover:text-green-900 p-1 hover:bg-green-100 rounded"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onCancel(showtime)}
                      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-100 rounded"
                      title="Hủy lịch chiếu"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};