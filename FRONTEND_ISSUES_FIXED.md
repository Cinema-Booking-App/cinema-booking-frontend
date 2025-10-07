/**
 * Tài liệu hướng dẫn sửa lỗi Frontend
 * 
 * 🔍 CÁC LỖI ĐÃ PHÁT HIỆN:
 */

## ❌ **Lỗi 1: Cấu hình API URL**

### **Vấn đề:**
- File `.env` có `NEXT_PUBLIC_API_URL` bị comment
- WebSocket hardcode `localhost:8000` 
- HTTP API sử dụng `undefined` URL

### **Cách sửa:**
```bash
# .env - Bỏ comment và sửa URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## ❌ **Lỗi 2: Logic đặt ghế tự động sai**

### **Vấn đề:**
- Trong `booking-client.tsx`, có logic tự động đặt ghế sau 1 giây khi chọn
- Điều này không phù hợp UX và có thể gây conflict

### **Logic hiện tại (SAI):**
```typescript
// booking-client.tsx line 114-140
useEffect(() => {
  if (selectedSeats.length > 0) {
    const timeout = setTimeout(async () => {
      // Tự động gọi API đặt ghế sau 1 giây - SAI!
      await createMultipleReservations(reservationRequests).unwrap();
    }, 1000);
  }
}, [selectedSeats]);
```

### **Logic đúng:**
```typescript
// Chỉ gửi thông báo WebSocket khi chọn ghế để báo "đang chọn"
// Chỉ gọi API đặt ghế khi user nhấn nút "Xác nhận đặt vé"
```

---

## ❌ **Lỗi 3: Thiếu xử lý trạng thái "đang chọn"**

### **Vấn đề:**
- WebSocket chỉ xử lý `seats_reserved` và `seats_released`
- Không có trạng thái "đang chọn" để user khác thấy

### **Cần thêm:**
```typescript
// Trong WebSocket message types
case 'seat_selecting':
  // Hiển thị ghế đang được ai đó chọn (màu vàng)
  break;
case 'seat_deselected': 
  // Ghế không còn được chọn nữa
  break;
```

---

## 🛠️ **HƯỚNG DẪN SỬA CHI TIẾT:**

### **Bước 1: Sửa file `.env`**
```bash
# Bỏ comment dòng này
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### **Bước 2: Sửa WebSocket URL trong `useWebSocketSeat.ts`**
```typescript
// Thay đổi từ hardcode sang dynamic
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const wsUrl = `ws://${baseUrl.replace(/^https?:\/\//, '')}/ws/seats/${showtimeId}?session_id=${sessionId}`;
```

### **Bước 3: Xóa logic tự động đặt ghế trong `booking-client.tsx`**
```typescript
// XÓA toàn bộ useEffect auto-reserve này:
useEffect(() => {
  // Auto-reserve seats when selected (with debounce)
  // XÓA TOÀN BỘ LOGIC NÀY
}, [selectedSeats, ...]);
```

### **Bước 4: Thêm logic gửi WebSocket "đang chọn"**
```typescript
// Trong handleSeatClick
const handleSeatClick = useCallback((seatId: string) => {
  // ... existing logic ...
  
  if (isCurrentlySelected) {
    // Gửi WebSocket: không còn chọn ghế này
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'seat_deselected',
        seat_id: seatInfo.seat_id,
        session_id: sessionId,
        user_name: 'Current User'
      }));
    }
    return prev.filter(seat => seat !== seatId);
  } else {
    // Gửi WebSocket: đang chọn ghế này
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'seat_selecting',
        seat_id: seatInfo.seat_id,
        session_id: sessionId,
        user_name: 'Current User'
      }));
    }
    return [...prev, seatId];
  }
}, []);
```

### **Bước 5: Sửa BookingSidebar để có nút "Xác nhận đặt vé"**
```typescript
// Trong BookingSidebar, thêm function
const handleConfirmBooking = async () => {
  try {
    const reservationRequests = selectedSeats.map(seatCode => ({
      seat_id: getSeatId(seatCode),
      showtime_id: showtimeId,
      session_id: sessionId,
      status: 'pending'
    }));

    await createMultipleReservations(reservationRequests).unwrap();
    
    // Chuyển đến trang thanh toán
    router.push('/payment');
  } catch (error) {
    alert('Lỗi khi đặt ghế: ' + error.message);
  }
};
```

### **Bước 6: Cập nhật WebSocket message handler**
```typescript
// Trong useWebSocketSeat.ts, thêm case mới
switch (message.type) {
  // ... existing cases ...
  
  case 'seat_selecting':
    // Ai đó đang chọn ghế
    onSeatSelecting?.(message.data);
    break;
    
  case 'seat_deselected':
    // Ai đó bỏ chọn ghế
    onSeatDeselected?.(message.data);
    break;
}
```

---

## 🎯 **LUỒNG HOẠT ĐỘNG ĐÚNG:**

### **1. Khi user chọn ghế:**
```
User click ghế → Update selectedSeats state → 
Gửi WebSocket "seat_selecting" → 
User khác thấy ghế màu vàng "đang được chọn"
```

### **2. Khi user bỏ chọn ghế:**
```
User click lại ghế → Remove từ selectedSeats → 
Gửi WebSocket "seat_deselected" → 
Ghế về màu xanh "available"
```

### **3. Khi user xác nhận đặt vé:**
```
User nhấn "Xác nhận đặt vé" → 
Gọi API createMultipleReservations → 
Backend gửi WebSocket "seats_reserved" → 
Tất cả user thấy ghế màu đỏ "đã đặt"
```

---

## 🚨 **LƯU Ý QUAN TRỌNG:**

1. **Không tự động đặt ghế** khi user chỉ đang chọn
2. **Phải có nút xác nhận** để user chủ động đặt
3. **WebSocket chỉ để thông báo**, không thay thế HTTP API
4. **Xử lý lỗi** khi API call fail
5. **Validation** số lượng ghế tối đa (8 ghế/lần)

---

## 📝 **CHECKLIST SAU KHI SỬA:**

- [ ] `.env` có `NEXT_PUBLIC_API_URL` đúng
- [ ] WebSocket connect được với backend
- [ ] Chọn ghế không tự động gọi API
- [ ] Có nút "Xác nhận đặt vé" 
- [ ] User khác thấy ghế "đang được chọn"
- [ ] API reservation chỉ được gọi khi confirm
- [ ] Error handling cho API calls
- [ ] WebSocket reconnection hoạt động

🎉 **Sau khi sửa những lỗi này, hệ thống realtime sẽ hoạt động đúng!**