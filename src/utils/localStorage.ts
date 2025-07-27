// src/utils/localStorage.ts

export const loadFromLocalStorage = (key: string = 'accessToken'): string | null => {
    try {
        // Chỉ cố gắng truy cập localStorage nếu đang chạy trên trình duyệt (client-side)
        if (typeof window !== 'undefined') {
            return localStorage.getItem(key);
        }
        return null; // Trả về null nếu không phải môi trường trình duyệt
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
    }
};

export const saveToLocalStorage = (token: string, key: string = 'accessToken'): void => {
    try {
        // Chỉ cố gắng truy cập localStorage nếu đang chạy trên trình duyệt (client-side)
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, token);
        }
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

export const removeFromLocalStorage = (key: string = 'accessToken'): void => {
    try {
        // Chỉ cố gắng truy cập localStorage nếu đang chạy trên trình duyệt (client-side)
        if (typeof window !== 'undefined') {
            localStorage.removeItem(key);
        }
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
};