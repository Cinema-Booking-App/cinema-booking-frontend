
export interface User {
  user_id: number;      
  email: string;
  full_name: string;
  phone_number: string;
  role: string;
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