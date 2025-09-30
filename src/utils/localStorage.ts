import { User } from "@/types/user";

export const saveToLocalStorage = (token: string, user?: User) => {
  try {
    localStorage.setItem('token', token);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromLocalStorage = (): { token: string | null; user: User | null } => {
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
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};