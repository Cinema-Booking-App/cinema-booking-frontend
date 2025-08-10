'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SeatLayoutDetail } from '@/types/layouts';

interface SeatLayoutFormProps {
  editedLayout: SeatLayoutDetail;
  onLayoutChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const SeatLayoutForm: React.FC<SeatLayoutFormProps> = ({ editedLayout, onLayoutChange }) => {
  return (
    <>
      <div className="space-y-2">
        <div>
          <Label className="text-sm font-medium">Tên bố cục</Label>
          <Input
            name="layout_name"
            value={editedLayout?.layout_name || ''}
            onChange={onLayoutChange}
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
              onChange={onLayoutChange}
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
              onChange={onLayoutChange}
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
            onChange={onLayoutChange}
            className="mt-1 text-sm resize-none"
            rows={2}
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Vị trí lối đi</Label>
          <Input
            name="aisle_positions"
            value={editedLayout?.aisle_positions || ''}
            onChange={onLayoutChange}
            placeholder="R2C3,R4C5"
            className="mt-1 h-8"
          />
        </div>
      </div>
    </>
  );
};

export default SeatLayoutForm;
