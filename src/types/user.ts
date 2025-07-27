export interface User {
  id: string; 
  fullName: string; 
  email: string;
  phoneNumber?: string;
  status: 'active' | 'inactive' | 'suspended'; 
  role: 'customer' | 'admin' | 'staff'; 
  createdAt: string; 
  updatedAt: string; 
}