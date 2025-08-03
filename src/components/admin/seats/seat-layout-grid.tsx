'use client';

import React, { useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SeatLayoutDetail, SeatTemplates } from '@/types/layouts';

interface SeatLayoutGridProps {
  editedLayout: SeatLayoutDetail;
  onSeatChange: (seatId: number, field: keyof SeatTemplates, value: any) => void;
}

const SeatLayoutGrid: React.FC<SeatLayoutGridProps> = ({ editedLayout, onSeatChange }) => {
  // Tạo ma trận ghế từ dữ liệu layout
  const seatMatrix = useMemo(() => {
    if (!editedLayout) return [];
    const matrix: (SeatTemplates | 'AISLE' | null)[][] = Array(editedLayout.total_rows)
      .fill(null)
      .map(() => Array(editedLayout.total_columns).fill(null));

    editedLayout.seat_templates.forEach(seat => {
      if (seat.row_number > 0 && seat.row_number <= editedLayout.total_rows &&
          seat.column_number > 0 && seat.column_number <= editedLayout.total_columns) {
        matrix[seat.row_number - 1][seat.column_number - 1] = seat;
      }
    });

    const aislePositions = editedLayout.aisle_positions
      .split(',')
      .map(pos => pos.trim())
      .filter(pos => pos.match(/^R(\d+)C(\d+)$/i));

    aislePositions.forEach(pos => {
      const match = pos.match(/^R(\d+)C(\d+)$/i);
      if (match) {
        const row = parseInt(match[1]) - 1;
        const col = parseInt(match[2]) - 1;
        if (row >= 0 && row < editedLayout.total_rows &&
            col >= 0 && col < editedLayout.total_columns) {
          matrix[row][col] = 'AISLE';
        }
      }
    });
    return matrix;
  }, [editedLayout]);

  // Các hàm helper
  const getSeatColor = (seat: SeatTemplates) => {
    switch (seat.seat_type) {
      case 'vip': return "bg-yellow-500 text-yellow-900 border-yellow-600";
      case 'couple': return "bg-pink-500 text-white border-2 border-pink-700";
      default: return "bg-blue-500 text-white border-blue-600";
    }
  };

  const getCoupleSpan = (seat: SeatTemplates, rowIndex: number, colIndex: number) => {
    if (seat.seat_type !== 'couple') return 1;
    const nextSeat = seatMatrix[rowIndex]?.[colIndex + 1];
    if (nextSeat === null || nextSeat === undefined) {
      return 2;
    }
    return 1;
  };

  const shouldSkipSeat = (rowIndex: number, colIndex: number) => {
    if (colIndex === 0) return false;
    const prevSeat = seatMatrix[rowIndex]?.[colIndex - 1];
    if (prevSeat && typeof prevSeat === 'object' && prevSeat.seat_type === 'couple') {
      const nextSeat = seatMatrix[rowIndex]?.[colIndex];
      if (nextSeat === null || nextSeat === undefined) {
        return true;
      }
    }
    return false;
  };

  const getSeatSize = () => {
    if (!editedLayout) return { width: 'w-7', height: 'h-7', text: 'text-xs' };
    const totalCols = editedLayout.total_columns;
    if (totalCols <= 8) return { width: 'w-8 sm:w-9', height: 'h-8 sm:h-9', text: 'text-xs sm:text-sm' };
    if (totalCols <= 12) return { width: 'w-7 sm:w-8', height: 'h-7 sm:h-8', text: 'text-xs' };
    return { width: 'w-6 sm:w-7', height: 'h-6 sm:h-7', text: 'text-[10px] sm:text-xs' };
  };

  const seatSize = getSeatSize();

  return (
    <div className="border rounded-lg p-3 bg-gray-50">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-full max-w-xs bg-gray-800 text-white text-center py-2 rounded text-sm font-semibold">
          MÀN HÌNH
        </div>
        {editedLayout && editedLayout.total_rows > 0 && editedLayout.total_columns > 0 ? (
          <div className="w-full overflow-x-auto">
            <div 
              className="grid gap-1 mx-auto"
              style={{
                gridTemplateColumns: `auto repeat(${editedLayout.total_columns}, minmax(0, 1fr))`,
                width: 'fit-content'
              }}
            >
              <div></div>
              {Array.from({ length: editedLayout.total_columns }).map((_, colIndex) => (
                <div 
                  key={colIndex} 
                  className={`${seatSize.width} ${seatSize.height} flex items-center justify-center ${seatSize.text} font-medium text-gray-600 bg-gray-200 rounded`}
                >
                  {colIndex + 1}
                </div>
              ))}
              {seatMatrix.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <div className={`${seatSize.width} ${seatSize.height} flex items-center justify-center ${seatSize.text} font-medium text-gray-600 bg-gray-200 rounded`}>
                    {String.fromCharCode(65 + rowIndex)}
                  </div>
                  {row.map((cell, colIndex) => {
                    if (shouldSkipSeat(rowIndex, colIndex)) {
                      return null;
                    }
                    if (cell === 'AISLE') {
                      return (
                        <div 
                          key={colIndex} 
                          className={`${seatSize.width} ${seatSize.height} border border-dashed border-gray-400 bg-gray-100 rounded flex items-center justify-center text-[8px] text-gray-500`}
                        >
                          ▫
                        </div>
                      );
                    } else if (cell === null) {
                      return null
                    } else {
                      const seat = cell as SeatTemplates;
                      const colspan = getCoupleSpan(seat, rowIndex, colIndex);
                      
                      // Kiểm tra xem ghế bên cạnh có trống không để bật/tắt tùy chọn ghế đôi
                      const isNextSeatAvailable = 
                        colIndex < editedLayout.total_columns - 1 && seatMatrix[rowIndex]?.[colIndex + 1] === null;

                      return (
                        <Popover key={seat.template_id}>
                          <PopoverTrigger asChild>
                            <Button
                              size="sm"
                              className={`${seatSize.width} ${seatSize.height} p-0 ${seatSize.text} font-medium rounded ${getSeatColor(seat)} hover:opacity-80 transition-opacity relative`}
                              style={seat.seat_type === 'couple' ? {
                                gridColumn: `span 2`,
                                width: 'auto'
                              } : {}}
                            >
                              <span className="flex items-center justify-center gap-1">
                                {seat.seat_type === 'couple' && colspan > 1 ? 
                                  `${colIndex + 1}-${colIndex + 2}` : 
                                  colIndex + 1
                                }
                                {seat.seat_type === 'couple' && (
                                  <span className="text-[8px]">💕</span>
                                )}
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-3">
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-medium">{seat.seat_code}</h4>
                                <p className="text-sm text-gray-600">
                                  Hàng {seat.row_number}, Cột {seat.column_number}
                                  {seat.seat_type === 'couple' && colspan > 1 && ` - ${seat.column_number + 1}`}
                                </p>
                              </div>
                              
                              <div>
                                <Label className="text-sm">Loại ghế</Label>
                                <Select
                                  value={seat.seat_type}
                                  onValueChange={(value: 'regular' | 'vip' | 'couple') => {
                                    // Thêm logic kiểm tra trước khi cập nhật
                                    if (value === 'couple' && !isNextSeatAvailable) {
                                      // Có thể thêm toast hoặc thông báo khác ở đây nếu cần
                                      console.error("Không đủ chỗ để đổi sang ghế đôi.");
                                      return;
                                    }
                                    onSeatChange(seat.template_id, 'seat_type', value)
                                  }}
                                >
                                  <SelectTrigger className="w-full mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="regular">Thường</SelectItem>
                                    <SelectItem value="vip">VIP</SelectItem>
                                    <SelectItem
                                      value="couple"
                                      disabled={!isNextSeatAvailable}
                                      title={!isNextSeatAvailable ? "Ghế bên cạnh không trống" : ""}
                                    >
                                      Ghế đôi
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      );
                    }
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>Nhập số hàng và cột để hiển thị sơ đồ ghế</p>
          </div>
        )}
      </div>
      </div>
      )}
export default SeatLayoutGrid