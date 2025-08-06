export interface Promotion {
  id: number;
  name: string;
  code: string;
  type: string;
  value: number | string | null;
  valueType: string | null;
  startDate: string;
  endDate: string;
  status: string;
  used: number;
  usageLimit: number | string | null;
  enabled?: boolean;
  description?: string;
}

export type CreatePromotion = Omit<Promotion, 'id' | 'used'>;
export type UpdatePromotion = Partial<CreatePromotion>;