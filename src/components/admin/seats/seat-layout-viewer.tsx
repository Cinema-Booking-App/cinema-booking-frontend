'use client'
import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SeatLayoutDetail, SeatTemplates } from '@/types/layouts';


interface SeatLayoutDialogProps {
  layoutDetail: SeatLayoutDetail | null | undefined;
  open: boolean;
  onClose: () => void;
  onSave?: (updatedLayout: SeatLayoutDetail) => void;
}

const SeatLayoutDialog: React.FC<SeatLayoutDialogProps> = ({
  layoutDetail,
  open,
  onClose,
  onSave,
}) => {
  const [editedLayout, setEditedLayout] = useState<SeatLayoutDetail | null>(null);

  useEffect(() => {
    if (layoutDetail) {
      setEditedLayout({ ...layoutDetail });
    } else {
      setEditedLayout(null);
    }
  }, [layoutDetail]);

  if (!layoutDetail || !open) {
    return null;
  }

  const handleLayoutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedLayout((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: name === 'total_rows' || name === 'total_columns' ? parseInt(value) || 0 : value,
      };
    });
  };

  const handleSeatTemplateChange = (
    rowNumber: number,
    columnNumber: number,
    field: keyof SeatTemplates,
    value: any
  ) => {
    setEditedLayout((prev) => {
      if (!prev) return null;
      const updatedTemplates = prev.seat_templates.map((seat) => {
        if (seat.row_number === rowNumber && seat.column_number === columnNumber) {
          return { ...seat, [field]: value };
        }
        return seat;
      });
      return {
        ...prev,
        seat_templates: updatedTemplates,
      };
    });
  };

  const handleSave = () => {
    if (onSave && editedLayout) {
      onSave(editedLayout);
    }
    onClose();
  };

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

  const getSeatColor = (seat: SeatTemplates) => {
    switch (seat.seat_type) {
      case 'vip': return "bg-yellow-500 text-yellow-900 border-yellow-600";
      case 'couple': return "bg-pink-500 text-white border-2 border-pink-700";
      default: return "bg-blue-500 text-white border-blue-600";
    }
  };

  // Kiểm tra ghế đôi có ghế bên cạnh trống để gộp
  const getCoupleSpan = (seat: SeatTemplates, rowIndex: number, colIndex: number) => {
    if (seat.seat_type !== 'couple') return 1;
    
    const nextSeat = seatMatrix[rowIndex]?.[colIndex + 1];
    // Nếu ghế bên cạnh trống hoặc null thì gộp 2 cột
    if (nextSeat === null || nextSeat === undefined) {
      return 2;
    }
    return 1;
  };

  // Kiểm tra có nên skip ghế này không (đã được gộp bởi ghế trước)
  const shouldSkipSeat = (rowIndex: number, colIndex: number) => {
    if (colIndex === 0) return false;
    
    const prevSeat = seatMatrix[rowIndex]?.[colIndex - 1];
    if (prevSeat && typeof prevSeat === 'object' && prevSeat.seat_type === 'couple') {
      const nextSeat = seatMatrix[rowIndex]?.[colIndex];
      // Nếu ghế trước là couple và ghế hiện tại trống thì skip
      if (nextSeat === null || nextSeat === undefined) {
        return true;
      }
    }
    return false;
  };

  // Tính toán kích thước ghế responsive - Compact
  const getSeatSize = () => {
    if (!editedLayout) return { width: 'w-7', height: 'h-7', text: 'text-xs' };
    
    const totalCols = editedLayout.total_columns;
    if (totalCols <= 8) return { width: 'w-8 sm:w-9', height: 'h-8 sm:h-9', text: 'text-xs sm:text-sm' };
    if (totalCols <= 12) return { width: 'w-7 sm:w-8', height: 'h-7 sm:h-8', text: 'text-xs' };
    return { width: 'w-6 sm:w-7', height: 'h-6 sm:h-7', text: 'text-[10px] sm:text-xs' };
  };

  const seatSize = getSeatSize();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-[85vw] lg:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-lg sm:text-xl">
            {layoutDetail.layout_name}
          </DialogTitle>
          <DialogDescription className="text-sm">
            Chỉnh sửa sơ đồ ghế và thông tin bố cục
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">{/* Form chỉnh sửa - Compact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div>
                <Label className="text-sm font-medium">Tên bố cục</Label>
                <Input
                  name="layout_name"
                  value={editedLayout?.layout_name || ''}
                  onChange={handleLayoutChange}
                  className="mt-1 h-8"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-sm font-medium">Số hàng</Label>
                  <Input
                    name="total_rows"
                    type="number"
                    value={editedLayout?.total_rows || 0}
                    onChange={handleLayoutChange}
                    className="mt-1 h-8"
                    min="1"
                    max="30"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Số cột</Label>
                  <Input
                    name="total_columns"
                    type="number"
                    value={editedLayout?.total_columns || 0}
                    onChange={handleLayoutChange}
                    className="mt-1 h-8"
                    min="1"
                    max="30"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <Label className="text-sm font-medium">Mô tả</Label>
                <Textarea
                  name="description"
                  value={editedLayout?.description || ''}
                  onChange={handleLayoutChange}
                  className="mt-1 text-sm resize-none"
                  rows={2}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Vị trí lối đi</Label>
                <Input
                  name="aisle_positions"
                  value={editedLayout?.aisle_positions || ''}
                  onChange={handleLayoutChange}
                  placeholder="R2C3,R4C5"
                  className="mt-1 h-8"
                />
              </div>
            </div>
          </div>

          {/* Sơ đồ ghế - Compact */}
          <div className="border rounded-lg p-3 bg-gray-50">
            <div className="flex flex-col items-center space-y-3">
              {/* Màn hình */}
              <div className="w-full max-w-xs bg-gray-800 text-white text-center py-2 rounded text-sm font-semibold">
                MÀN HÌNH
              </div>

              {/* Grid ghế */}
              {editedLayout && editedLayout.total_rows > 0 && editedLayout.total_columns > 0 ? (
                <div className="w-full overflow-x-auto">
                  <div 
                    className="grid gap-1 mx-auto"
                    style={{
                      gridTemplateColumns: `auto repeat(${editedLayout.total_columns}, minmax(0, 1fr))`,
                      width: 'fit-content'
                    }}
                  >
                    {/* Header số cột */}
                    <div></div>
                    {Array.from({ length: editedLayout.total_columns }).map((_, colIndex) => (
                      <div 
                        key={colIndex} 
                        className={`${seatSize.width} ${seatSize.height} flex items-center justify-center ${seatSize.text} font-medium text-gray-600 bg-gray-200 rounded`}
                      >
                        {colIndex + 1}
                      </div>
                    ))}

                    {/* Hàng ghế */}
                    {seatMatrix.map((row, rowIndex) => (
                      <React.Fragment key={rowIndex}>
                        {/* Label hàng */}
                        <div className={`${seatSize.width} ${seatSize.height} flex items-center justify-center ${seatSize.text} font-medium text-gray-600 bg-gray-200 rounded`}>
                          {String.fromCharCode(65 + rowIndex)}
                        </div>
                        
                        {/* Ghế trong hàng */}
                        {row.map((cell, colIndex) => {
                          // Skip nếu ghế này đã được gộp bởi ghế couple trước đó
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
                                        onValueChange={(value: 'regular' | 'vip' | 'couple') =>
                                          handleSeatTemplateChange(seat.row_number, seat.column_number, 'seat_type', value)
                                        }
                                      >
                                        <SelectTrigger className="w-full mt-1">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="regular">Regular</SelectItem>
                                          <SelectItem value="vip">VIP</SelectItem>
                                          <SelectItem value="couple">Couple</SelectItem>
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

          {/* Legend - Compact */}
          <div className="bg-white rounded-lg border p-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Regular</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>VIP</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-6 h-3 bg-pink-500 border border-pink-700 rounded flex items-center justify-center text-[8px] text-white">💕</div>
                <span>Couple</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 border border-dashed border-gray-400 bg-gray-100 rounded"></div>
                <span>Lối đi</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-3 gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="text-sm py-2"
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSave}
            className="text-sm py-2"
          >
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SeatLayoutDialog;