"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, TicketIcon } from "lucide-react";

export default function VNPayReturnPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleReturn() {
      try {
        const search = window.location.search.replace("?", "");
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/payments/vnpay/return?${search}`;

        const res = await fetch(apiUrl);

        if (!res.ok) {
          setError("Không thể xử lý thanh toán.");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setResult(data.data);
      } catch (err) {
        setError("Có lỗi xảy ra khi xử lý thanh toán.");
      } finally {
        setLoading(false);
      }
    }

    handleReturn();
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-6">
      <div className="w-[380px] bg-white rounded-2xl shadow-xl border p-6 text-center space-y-5">
        
        {/* LOADING */}
        {loading && (
          <div className="py-10 text-lg text-gray-600">
            🔄 Đang xử lý thanh toán...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="space-y-4">
            <XCircle className="mx-auto text-red-600" size={60} />
            <h2 className="text-2xl font-bold text-red-600">Thanh toán thất bại</h2>
            <p className="text-gray-600">{error}</p>

            <a
              href="/"
              className="inline-block mt-4 bg-red-600 text-white px-6 py-3 rounded-xl shadow hover:bg-red-700 transition"
            >
              Quay lại trang chủ
            </a>
          </div>
        )}

        {/* SUCCESS */}
        {!loading && !error && result && (
          <div className="space-y-4">
            <CheckCircle className="mx-auto text-green-600" size={60} />
            <h2 className="text-2xl font-bold text-green-600">
              Thanh toán thành công!
            </h2>

            <div className="text-left space-y-2 text-sm mt-4">
              {/* <p><b>Mã đơn hàng:</b> {result.order_id}</p> */}
              <p><b>Mã đặt vé:</b> {result.booking_code}</p>
              <p><b>Trạng thái:</b> {result.payment_status}</p>
            </div>

            <a
              href="/myticket"
              className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl shadow hover:bg-red-700 transition mt-4"
            >
              <TicketIcon size={18} /> Xem vé của bạn
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
