export enum ComboStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DELETED = "deleted",
}

export interface ComboDishResponse {
  dish_id: number;
  dish_name: string;
  description: string | null;
}

export interface ComboItemBase {
  dish_id: number;
  quantity: number;
}

export interface ComboItemResponse {
  item_id: number;
  dish_id: number;
  quantity: number;
  dish_name: string;
  description: string | null;
}

export interface ComboBase {
  combo_name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  status: ComboStatusEnum;
}

export interface ComboCreate extends ComboBase {
  items: ComboItemBase[];
}

export interface ComboUpdate extends ComboBase {
  items?: ComboItemBase[] | null;
}

export interface ComboResponse extends ComboBase {
  combo_id: number;
  created_at: string;
  items: ComboItemResponse[];
}

export interface DishCreate {
  dish_name: string;
  description: string | null;
}