"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import { useResendVerificationMutation, useVerifyEmailMutation } from "@/store/slices/auth/authApi";
import { setRegisterEmail } from "@/store/slices/auth/authSlide";

export default function VerifyEmailPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const email = useAppSelector((state) => state.auth.registerEmail);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verifyEmail] = useVerifyEmailMutation();
  const [resendVerificationCode] = useResendVerificationMutation();

  // Xử lý thay đổi OTP
  const handleOtpChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError(null);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  // Xử lý phím Backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // Xử lý dán OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pastedData.length <= 6) {
      setOtp(pastedData.padEnd(6, "").split("").slice(0, 6));
    }
  };

  // Kiểm tra OTP hợp lệ
  const validateOtp = () => otp.join("").length === 6;

  // Xử lý xác thực
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOtp()) {
      setError("Vui lòng nhập mã OTP 6 chữ số");
      return;
    }

    setIsLoading(true);
    try {
      await verifyEmail({ email: email || "", verification_code: otp.join("") }).unwrap();
      dispatch(setRegisterEmail(null)); // Xóa email khỏi store
      router.push("/"); // Chuyển hướng về đăng nhập
    } catch (err: any) {
      setError(err?.data?.message || "Xác thực thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý gửi lại mã
  const handleResend = async () => {
    if (!email) {
      setError("Không tìm thấy email.");
      return;
    }

    setIsResending(true);
    try {
      await resendVerificationCode({ email }).unwrap();
      setOtp(Array(6).fill(""));
      setCountdown(60);
    } catch (err: any) {
      setError(err?.data?.message || "Không thể gửi lại mã. Vui lòng thử lại.");
    } finally {
      setIsResending(false);
    }
  };

  // Countdown cho gửi lại
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  // Chuyển hướng nếu không có email
  useEffect(() => {
    if (!email) {
      router.push("/login");
    }
  }, [email, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold">Xác thực Email</CardTitle>
            <CardDescription>
              Nhập mã 6 chữ số đã gửi đến <strong>{email || "email của bạn"}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              {error && (
                <div className="p-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-10 h-10 text-center text-lg border-2 focus:border-blue-500"
                    disabled={isLoading}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || !validateOtp()}>
                {isLoading ? "Đang xác thực..." : "Xác thực"}
              </Button>
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
                    Gửi lại mã
                  </>
                )}
              </Button>
              <div className="text-center text-sm">
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 flex items-center justify-center space-x-1"
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
  );
}