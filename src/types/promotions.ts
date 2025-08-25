export interface Promotion {

  promotion_id: number;
  code: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  max_usage?: number;
  used_count: number;
  description?: string;
  is_active: boolean;
  created_at: string;
}


export type CreatePromotion = Omit<Promotion, 'promotion_id' | 'used_count' | 'created_at'>;
export type UpdatePromotion = Partial<CreatePromotion>;