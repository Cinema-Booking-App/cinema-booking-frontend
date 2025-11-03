'use client'

import { useLazyVnpReturnQuery } from '@/store/slices/payments/paymentsApi'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

function VNPayReturnContent() {
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-lg font-medium text-foreground">Đang xác nhận thanh toán...</p>
      </div>
    )
  }

  if (data?.payment_status === 'SUCCESS') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="bg-card text-card-foreground shadow-xl rounded-2xl p-8 text-center max-w-xl w-full mx-4 border border-border">
          <div className="flex items-center justify-center mb-4">
            <svg width="72" height="72" viewBox="0 0 24 24" className="mr-2" fill="none">
              <circle cx="12" cy="12" r="10" fill="oklch(0.95 0.05 145)" />
              <path d="M7 12l2.5 2.5L17 7" stroke="oklch(0.55 0.15 145)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Thanh toán thành công</h2>
          <p className="mt-2 text-sm text-muted-foreground">Cảm ơn bạn — hãy kiểm tra hộp thư đến của bạn.</p>

          <div className="mt-6">
            <p className="text-xs text-muted-foreground">Mã đặt vé</p>
            <div className="mt-2 flex items-center justify-center gap-3">
              <code className="px-3 py-2 rounded-lg bg-muted text-foreground font-medium text-lg tracking-wider">{data.booking_code}</code>
              <button 
                onClick={() => handleCopy(data.booking_code)} 
                className="px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm transition-colors"
              >
                {copied ? 'Đã sao chép' : 'Sao chép'}
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Vui lòng lưu mã này để xem hoặc in vé.</p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => router.push('/tickets')} 
              className="px-5 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
            >
              Xem vé ngay
            </button>
            <button 
              onClick={() => router.push('/')} 
              className="px-5 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border rounded-lg transition-colors"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (data?.payment_status === 'FAILED') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="bg-card text-card-foreground shadow-xl rounded-2xl p-8 text-center max-w-md w-full mx-4 border border-border">
          <div className="flex items-center justify-center mb-4">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="oklch(0.95 0.05 25)" />
              <path d="M9 9l6 6M15 9l-6 6" stroke="oklch(0.577 0.245 27.325)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Thanh toán thất bại</h2>
          <p className="mt-3 text-muted-foreground">Thanh toán không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>

          <div className="mt-6 flex gap-3 justify-center">
            <button 
              onClick={() => router.push('/payment')} 
              className="px-5 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
            >
              Thử lại
            </button>
            <button 
              onClick={() => router.push('/')} 
              className="px-5 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border rounded-lg transition-colors"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default function VNPayReturnPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-lg font-medium text-foreground">Đang tải...</p>
      </div>
    }>
      <VNPayReturnContent />
    </Suspense>
  )
}