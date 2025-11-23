
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Booking } from '@/types/bookings';
import Logo from "@/components/client/layouts/header/logo";

interface PrintTicketProps {
  booking: Booking | null;
  onClose: () => void;
}

const PrintTicket: React.FC<PrintTicketProps> = ({ booking, onClose }) => {
  console.log(booking)
  useEffect(() => {
    if (booking && typeof window !== 'undefined') {
      setTimeout(() => {
        const clear = () => {
          onClose();
          window.onafterprint = null;
        };
        window.onafterprint = clear;
        window.print();
      }, 100);
    }
  }, [booking, onClose]);

  if (!booking || typeof window === 'undefined') return null;

  return createPortal(
    <>
      <style>{`
        @media print {
          .print-area {
            display: block !important;
            background: white !important;
            position: static !important;
            width: auto !important;
            height: auto !important;
            min-height: unset !important;
            align-items: unset !important;
            justify-content: unset !important;
          }
          .ticket-container {
            width: 250mm !important;
            min-width: 0 !important;
            max-width: 100vw !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            background: white !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: start !important;
            min-height: 100vh !important;
            font-size: 35px !important;
            border: none !important;
          }
        }
      `}</style>
      <div className="print-area" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {(booking.tickets || []).map((t: any, i: number) => (
          <div
            key={i}
            className="ticket-container border-2 border-dashed border-yellow-600"
            style={{ pageBreakAfter: i !== (booking.tickets.length - 1) ? 'always' : 'auto' }}
          >
            {/* Header/logo */}
            <div style={{
              background: 'linear-gradient(90deg, #2563eb 60%, #60a5fa 100%)',
              color: 'white',
              padding: '18px 0 10px 0',
              textAlign: 'center',
              letterSpacing: 2,
              borderBottom: '2px dashed #2563eb',
              position: 'relative'
            }}>
              {/* <Logo/> */}
              <div>VÉ XEM PHIM</div>
              <div className="text-red-700">Cinema Booking</div>
            </div>
            {/* Main info */}
            <div style={{ padding: 20, paddingBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="flex gap-4">Mã vé:
                  <p className="text-blue-600" style={{ fontFamily: 'monospace' }}>
                    {booking.code}
                  </p>
                </span>
              </div>
              <div style={{ marginBottom: 6 }}><b>Khách:</b> {booking.customer}</div>
              <div style={{ marginBottom: 6 }}><b>Email:</b> {booking.email}</div>
              <div style={{ marginBottom: 6 }}><b>Phim:</b> <span style={{ fontWeight: 600 }}>{booking.movie}</span></div>
              <div style={{ marginBottom: 6 }}><b>Suất chiếu:</b> {booking.showtime}</div>
              <div style={{ marginBottom: 6 }}><b>Ghế:</b> <span style={{ fontWeight: 600 }}>{t.seat}</span></div>
              <div style={{ marginBottom: 6 }}><b>Trạng thái:</b> <span style={{ color: booking.status === 'Đã thanh toán' ? '#16a34a' : booking.status === 'Đã hoàn vé' ? '#dc2626' : '#eab308', fontWeight: 600 }}>{booking.status}</span></div>
              <div style={{ marginBottom: 6 }}><b>Loại vé:</b> {(() => {
                if (!t || !t.type) return '';
                if (typeof t.type === 'string') {
                  // Nếu là enum kiểu 'SeatTypeEnum.regular' thì lấy phần sau dấu chấm
                  let type = t.type;
                  if (type.includes('.')) type = type.split('.').pop() || type;
                  type = type.toLowerCase();
                  if (type === 'vip') return ' VIP';
                  if (type === 'regular' || type === 'thường') return 'thường';
                  if (type === 'sweetbox' || type === 'couple') return 'đôi';
                  if (type === 'deluxe') return 'Deluxe';
                  if (type === 'family') return 'Gia đình';
                  // Thêm các loại khác nếu có
                  return type.charAt(0).toUpperCase() + type.slice(1);
                }
                return t.type;
              })()}</div>
            </div>
            {/* QR and code */}
            <div style={{
              borderTop: '2px dashed #2563eb',
              background: '#f1f5f9',
              padding: 18,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6
            }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>Mã QR check-in</div>
              {/* Nếu có thể, nên render ảnh QR thực tế, ở đây chỉ là text */}
              <div style={{ background: '#fff', padding: 8, borderRadius: 8, marginBottom: 4, }}>
                {/* Hiển thị mã QR nếu backend trả `qr_code` ở cấp booking */}
                {booking.qr_code && (
                  <div className="flex flex-col items-center mb-4">
                    <img
                      src={`data:image/png;base64,${booking.qr_code}`}
                      alt="QR vé"
                      className="w-40 h-40 mx-auto border rounded-lg"
                    />
                  </div>
                )}
              </div>
              <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 600, letterSpacing: 1 }}>{booking.code}</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Vui lòng xuất trình vé & mã QR tại quầy</div>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @media print {
          .print-area { display: block !important; }
          body > *:not(.print-area) { display: none !important; }
          .ticket-container { box-shadow: none !important; }
        }
      `}</style>
    </>,
    document.body
  );
};

export default PrintTicket;
