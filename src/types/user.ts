import { Role } from "./role";

export interface User {
  user_id: number;
  email: string;
  full_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  date_of_birth?: string | null; // ISO 8601 date string (e.g., "2023-01-01")
  gender?: Gender | null;
  status: UserStatus;
  is_verified: boolean;
  last_login?: string | null; // ISO 8601 datetime string
  loyalty_points: number;
  rank_id?: number | null;
  total_spent: number;
  roles: Role[];
  created_at: string; // ISO 8601 datetime string
  updated_at: string; // ISO 8601 datetime string
}

export type CreateUser = Omit<User, 'user_id' | 'created_at' | 'updated_at'>
export type UpdateUser = Omit<User, 'user_id' | 'created_at' | 'updated_at'>

// Type cho profile của user
export type UserProfile = {
  user_id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  date_of_birth?: string | null;
  gender?: Gender | null;
  loyalty_points: number;
  rank_id?: number | null;
};

// Enum cho user status
export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

// Enum cho gender
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

// Enum cho user role
export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  STAFF = 'staff',
}
export interface UserCurrent {
  user_id: number;      
  email: string;
  full_name: string;
  phone_number: string;
  avatar?: string;
  roles: Role[];
  lastLogin: string;
  status: string;
  created_at: string;
  updated_at: string;
}