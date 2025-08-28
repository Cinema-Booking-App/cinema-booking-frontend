import { Role } from "./role";

export interface User {
  user_id: number;      
  email: string;
  full_name: string;
  phone_number: string;
  status: string;
  created_at: string;
  updated_at: string;
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


// Enum cho user status
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

// Enum cho user role
export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  STAFF = 'staff'
}