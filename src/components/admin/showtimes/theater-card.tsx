import { Theaters } from "@/types/theaters";
import { Film, MapPin } from "lucide-react";
interface TheaterCardProps {
  theater: Theaters;
  onViewDetails: (theaterId: number) => void;
}
// Theater Overview Card Component
export const TheaterCard: React.FC<TheaterCardProps> = ({ theater, onViewDetails }) => (
  <div className="bg-background rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h3 className="font-semibold text-lg text-foreground">{theater.name}</h3>
        <p className="text-foreground flex items-center mt-1">
          <MapPin className="w-4 h-4 mr-1" />
          {theater.address}
        </p>
      </div>
      <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
        {theater.city} suất chiếu
      </span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-foreground">
        <Film className="w-4 h-4 inline mr-1" />
        {theater.name} phòng
      </span>
      <button
        onClick={() => onViewDetails(theater.theater_id)}
        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
      >
        Xem chi tiết
      </button>
    </div>
  </div>
);