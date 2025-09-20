"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Lock, EyeOff, Eye } from 'lucide-react'
import Logo from '@/components/client/layouts/header/logo'
import { useLoginMutation } from '@/store/slices/auth/authApi'
import { useAppSelector } from '@/store/store'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import LoadingComponent from '@/components/ui/cinema-loading'
import { LoginRequest } from '@/types/auth'

export default function LoginPage() {
  const [login, { error }] = useLoginMutation();
  const { isAuthenticated, isLoadingAuth } = useAppSelector(state => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false); // Thêm trạng thái chuyển hướng
  const router = useRouter();

  // Sử dụng useForm thay cho useState
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated && !isLoadingAuth) {
      router.push('/');
    }
  }, [isAuthenticated, isLoadingAuth, router]);

  // onSubmit function for react-hook-form
  const onSubmit = async (data: LoginRequest) => {
    await login(data).unwrap()
    setIsNavigating(true)
      
  };



  return (
    <div className="min-h-screen bg-background from-blue-50 via-white to-purple-50 flex justify-center p-4 mt-10 lg:mt-20">
      {(isNavigating) && < LoadingComponent />}
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 rounded-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
            <CardDescription>
              Đăng nhập vào tài khoản của bạn để tiếp tục
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Display general error from API */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {(error as any)?.data?.message || (error as any)?.message}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    {...register('email', {
                      required: 'Email là bắt buộc',
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: 'Email không hợp lệ',
                      },
                    })} // Inline validation rules
                    className={`pl-10 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
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
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu của bạn"
                    {...register('password', {
                      required: 'Mật khẩu là bắt buộc',
                      min: {
                        value: 6,
                        message: 'Mật khẩu phải có ít nhất 6 ký tự',
                      },
                    })} // Inline validation rules
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-muted-foreground">Ghi nhớ đăng nhập</span>
                </label>
                <Link
                  href="/quen-mat-khau"
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Đăng nhập
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
                <Button variant="outline" className="w-full py-2 px-4 rounded-md flex items-center justify-center border border-gray-300 hover:bg-gray-50 transition-colors">
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
                  Đăng nhập với Google
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Chưa có tài khoản?{' '}
                <Link
                  href="/dang-ky"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Đăng ký ngay
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
