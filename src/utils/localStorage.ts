// Lưu user vào localStorage từ token đã giải mã
export const saveUserFromToken = () => {
  if (typeof window === 'undefined') return;
  const { token } = getFromLocalStorage();
  if (!token) return;
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    // Tạo object user từ payload token
    const user = {
      user_id: decoded.user_id,
      email: decoded.sub,
      roles: decoded.roles,
      // Thêm các trường khác nếu cần
    };
    localStorage.setItem('user', JSON.stringify(user));
    console.log('Đã lưu user vào localStorage:', user);
    return user;
  } catch (error) {
    console.error('Lỗi lưu user từ token:', error);
  }
};
// Giải mã và log token ra console
export const logDecodedToken = () => {
  if (typeof window === 'undefined') return;
  const { token } = getFromLocalStorage();
  if (!token) {
    return;
  }
  try {
    // Giải mã phần payload của JWT
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    // console.log('Giải mã token:', decoded);
    return decoded;
  } catch (error) {
    console.error('Lỗi giải mã token:', error);
  }
};
// Kiểm tra user có phải admin không
export const isAdminUser = (): boolean => {
  if (typeof window === 'undefined') return false;
  const { user } = getFromLocalStorage();
  // console.log('User from localStorage:', user);
  if (!user || !Array.isArray(user.roles)) return false;
  
  // Danh sách các role được phép truy cập admin
  const adminRoles = ['super_admin', 'theater_admin', 'theater_manager','booking_staff'];
  
  return user.roles.some((r) => {
    // Kiểm tra nếu r là object có thuộc tính role_name
    const roleName = typeof r === 'object' && r !== null && 'role_name' in r 
      ? (r as any).role_name 
      : String(r);
    
    return adminRoles.includes(roleName);
  });
};
import { User } from "@/types/user";

export const saveToLocalStorage = (token: string, user?: User) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('token', token);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      // Nếu chưa có user, tự động giải mã từ token và lưu
      try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        const userObj = {
          user_id: decoded.user_id,
          email: decoded.sub,
          roles: decoded.roles,
        };
        localStorage.setItem('user', JSON.stringify(userObj));
        console.log('Đã tự động lưu user vào localStorage:', userObj);
      } catch (err) {
        console.error('Lỗi tự động lưu user từ token:', err);
      }
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromLocalStorage = (): { token: string | null; user: User | null } => {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return {
      token,
      user: user ? JSON.parse(user) : null,
    };
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return { token: null, user: null };
  }
};

export const removeFromLocalStorage = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};