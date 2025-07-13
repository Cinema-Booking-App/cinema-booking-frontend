"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, ArrowLeft, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [error, setError] = useState('')

  // Countdown timer for resend functionality
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }

    // Auto-focus previous input on backspace
    if (!value && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('')
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')])
    }
  }

  const validateOtp = () => {
    return otp.every(digit => digit !== '') && otp.join('').length === 6
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateOtp()) {
      setError('Vui lòng nhập đầy đủ 6 chữ số')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const otpCode = otp.join('')
      console.log('Verifying OTP:', otpCode)
      
      // TODO: Implement actual OTP verification logic here
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate verification result (replace with actual logic)
      const isSuccess = Math.random() > 0.3 // 70% success rate for demo
      
      if (isSuccess) {
        setVerificationStatus('success')
      } else {
        setVerificationStatus('error')
        setError('Mã xác thực không đúng. Vui lòng thử lại.')
      }
      
    } catch {
      setVerificationStatus('error')
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    setError('')
    
    try {
      // TODO: Implement actual resend logic here
      console.log('Resending verification email')
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Start countdown
      setCountdown(60)
      
      // Show success message
      alert('Email xác thực đã được gửi lại!')
      
    } catch {
      setError('Không thể gửi lại email. Vui lòng thử lại.')
    } finally {
      setIsResending(false)
    }
  }

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen bg-background from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-600">Xác thực thành công!</CardTitle>
              <CardDescription>
                Email của bạn đã được xác thực thành công. Bạn có thể đăng nhập ngay bây giờ.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full">
                <Link href="/login">
                  Đăng nhập ngay
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  Về trang chủ
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Xác thực Email</CardTitle>
            <CardDescription>
              Chúng tôi đã gửi mã xác thực 6 chữ số đến email của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <label className="text-sm font-medium text-center block">
                  Nhập mã xác thực
                </label>
                
                <div className="flex justify-center space-x-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-12 h-12 text-center text-lg font-semibold border-2 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isLoading}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Mã xác thực sẽ hết hạn sau 10 phút
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !validateOtp()}
              >
                {isLoading ? 'Đang xác thực...' : 'Xác thực'}
              </Button>

              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Không nhận được email?
                </p>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResend}
                  disabled={isResending || countdown > 0}
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Đang gửi lại...
                    </>
                  ) : countdown > 0 ? (
                    `Gửi lại sau ${countdown}s`
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Gửi lại mã xác thực
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <Link 
                  href="/login" 
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center justify-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại đăng nhập</span>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 