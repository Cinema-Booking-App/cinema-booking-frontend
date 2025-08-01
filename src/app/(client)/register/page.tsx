"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import Logo from '@/components/client/layouts/header/logo'
import { useRegisterMutation } from '@/store/slices/auth/authApi'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { RegisterRequest } from '@/types/auth'
import { setRegisterEmail } from '@/store/slices/auth/authSlide'

type FormData = RegisterRequest & {
  confirmPassword: string;
  acceptTerms: boolean;
};

export default function RegisterPage() {
  const [register, { isLoading, error }] = useRegisterMutation()
  // Lấy trạng thái xác thực từ Redux store
  const { isAuthenticated, isLoadingAuth } = useAppSelector(state => state.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()


  // Sử dụng useForm thay cho useState
  const { register: formRegister, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    }
  })

  const password = watch("password")

  const onSubmit = async (data: FormData) => {
    try {
      const registerData: RegisterRequest = {
        full_name: data.full_name,
        email: data.email,
        password: data.password,
      };

      await register(registerData).unwrap();
      dispatch(setRegisterEmail(data.email))
      router.push('/verify-email')

    } catch (err) {
      console.error("Registration error:", err);
    }
  }

  // Hiển thị loading khi đang kiểm tra trạng thái xác thực
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Đang tải...</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <CardTitle className="text-2xl font-bold">Đăng ký tài khoản</CardTitle>
            <CardDescription>
              Tạo tài khoản mới để bắt đầu trải nghiệm đặt vé xem phim
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Hiển thị lỗi chung từ API hoặc lỗi validation tổng quát */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {(error as any)?.data?.message || "Đăng ký thất bại. Vui lòng thử lại."}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="full_name" className="text-sm font-medium">
                  Họ và tên
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="full_name"
                    {...formRegister("full_name", {
                      required: "Họ và tên là bắt buộc",
                      minLength: {
                        value: 2,
                        message: "Họ và tên phải có ít nhất 2 ký tự",
                      },
                    })}
                    type="text"
                    placeholder="Nhập họ và tên của bạn"
                    className={`pl-10 ${errors.full_name ? 'border-red-500 focus:border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.full_name && (
                  <p className="text-sm text-red-600">{errors.full_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    {...formRegister("email", {
                      required: 'Email là bắt buộc',
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: 'Email không hợp lệ',
                      },
                    })}
                    placeholder="Nhập email của bạn"
                    className={`pl-10 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    {...formRegister("password", {
                      required: "Mật khẩu là bắt buộc",
                      minLength: {
                        value: 8,
                        message: "Mật khẩu phải có ít nhất 8 ký tự",
                      },
                      pattern: {
                        value: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: "Mật khẩu phải cso chữ hoa , chứ thường và sô"
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Tạo mật khẩu mới"
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full"
                    disabled={isLoading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu"
                    {...formRegister("confirmPassword", {
                      required: "Xác nhận mật khẩu là bắt buộc",
                      validate: (value) =>
                        value == password || "Mật khẩu không khớp"
                    })}
                    className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full"
                    disabled={isLoading}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    {...formRegister("acceptTerms", {
                      required: "Bạn phải đồng ý với điều khoản sử dụng",
                    })}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-muted-foreground">
                    Tôi đồng ý với{' '}
                    <Link
                      href="/dieu-khoan"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      target="_blank"
                    >
                      Điều khoản sử dụng
                    </Link>
                    {' '}và{' '}
                    <Link
                      href="/chinh-sach-bao-mat"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      target="_blank"
                    >
                      Chính sách bảo mật
                    </Link>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Hoặc
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Button variant="outline" className="w-full" disabled={isLoading}>
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Đăng ký với Google
                </Button>

                <Button variant="outline" className="w-full" disabled={isLoading}>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Đăng ký với Facebook
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Đã có tài khoản?{' '}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Đăng nhập ngay
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
