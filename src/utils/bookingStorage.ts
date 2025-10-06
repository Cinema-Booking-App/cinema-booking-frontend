export const BookingStorage = {
  // Lưu thông tin booking
  setBookingData: (data: any) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('bookingData', JSON.stringify(data));
    }
  },

  // Lấy thông tin booking
  getBookingData: () => {
    if (typeof window !== 'undefined') {
      const data = sessionStorage.getItem('bookingData');
      return data ? JSON.parse(data) : null;
    }
    return null;
  },

  // Xóa thông tin booking
  clearBookingData: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('bookingData');
    }
  },
};