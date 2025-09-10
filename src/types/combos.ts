// src/types/combos.tsx

export interface ComboItem {
  item_id: number;
  dish_id: number;
  quantity: number;
}

export interface Combo {
  combo_id: number;
  combo_name: string;
  description?: string;
  price: number;
  image_url?: string;
  status?: string;
  combo_items: ComboItem[];
}

export type CreateCombo = Omit<Combo, 'combo_id' | 'combo_items'> & {
  items: { dish_id: number; quantity: number }[];
};

export type UpdateCombo = Partial<Omit<Combo, 'combo_id' | 'combo_items'>> & {
  items?: { dish_id?: number; quantity?: number }[];
};

// Combo Dishes
export interface ComboDish {
  dish_id: number;
  dish_name: string;
  description?: string;
}

export type CreateComboDish = Omit<ComboDish, 'dish_id'>;
export type UpdateComboDish = Partial<CreateComboDish>;
