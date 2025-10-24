'use client'

import { useLazyVnpReturnQuery } from '@/store/slices/payments/paymentsApi'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function VNPayReturnPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [vnpReturn, { data, isLoading }] = useLazyVnpReturnQuery()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const queryString = searchParams.toString()
    if (queryString) {
      vnpReturn(queryString)
    }
  }, [searchParams])

  const handleCopy = async (text?: string) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen" style={{ background: 'var(--background, #f3f4f6)' }}>
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Đang xác nhận thanh toán...</p>
      </div>
    )
  }

  if (data?.payment_status === 'SUCCESS') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen" style={{ background: 'var(--background, #f3f4f6)' }}>
        <div className="bg-white shadow-xl rounded-2xl p-8 text-center max-w-xl w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <svg width="72" height="72" viewBox="0 0 24 24" className="mr-2" fill="none">
              <circle cx="12" cy="12" r="10" fill="#ecfdf5" />
              <path d="M7 12l2.5 2.5L17 7" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Thanh toán thành công</h2>
          <p className="mt-2 text-sm text-gray-600">Cảm ơn bạn — đặt vé đã được xử lý.</p>

          <div className="mt-6">
            <p className="text-xs text-gray-500">Mã đặt vé</p>
            <div className="mt-2 flex items-center justify-center gap-3">
              <code className="px-3 py-2 rounded-lg bg-gray-50 font-medium text-lg tracking-wider">{data.booking_code}</code>
              <button onClick={() => handleCopy(data.booking_code)} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
                {copied ? 'Đã sao chép' : 'Sao chép'}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">Vui lòng lưu mã này để xem hoặc in vé.</p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => router.push('/tickets')} className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Xem vé ngay</button>
            <button onClick={() => router.push('/')} className="px-5 py-3 border border-gray-200 rounded-lg">Về trang chủ</button>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            {data.transaction_id && <div>Transaction: <span className="font-medium text-gray-700">{data.transaction_id}</span></div>}
            {data.order_id && <div>Order: <span className="font-medium text-gray-700">{data.order_id}</span></div>}
          </div>
        </div>
      </div>
    )
  }

  if (data?.payment_status === 'FAILED') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen" style={{ background: 'var(--background, #f3f4f6)' }}>
        <div className="bg-white shadow-xl rounded-2xl p-8 text-center max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#fff1f2" />
              <path d="M9 9l6 6M15 9l-6 6" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Thanh toán thất bại</h2>
          <p className="mt-3 text-gray-600">Thanh toán không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>

          <div className="mt-6 flex gap-3 justify-center">
            <button onClick={() => router.push('/payment')} className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Thử lại</button>
            <button onClick={() => router.push('/')} className="px-5 py-3 border border-gray-200 rounded-lg">Về trang chủ</button>
          </div>
        </div>
      </div>
    )
  }

  // return <p>Đang xử lý dữ liệu...</p>
}
