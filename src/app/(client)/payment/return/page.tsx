'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

function PaymentReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'success' | 'failed' | 'error'>('processing');
  const [message, setMessage] = useState('Đang xử lý thanh toán...');
  const [details, setDetails] = useState<Record<string, string>>({});

  useEffect(() => {
    // Lấy tất cả params từ VNPAY
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    setDetails(params);

    // Gọi backend để xử lý thanh toán và tạo vé
    const queryString = new URLSearchParams(params).toString();
    const apiUrl =
      (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000') +
      '/payments/vnpay/return?' +
      queryString;

    const processPayment = async () => {
      try {
        const resp = await fetch(apiUrl, { method: 'GET' });
        const data = await resp.json();
        if (resp.ok && data.data?.status === 'success') {
          setStatus('success');
          setMessage(
            `Thanh toán thành công!${data.data.booking_code ? ' Mã đặt vé: ' + data.data.booking_code : ''}`
          );
          setDetails((prev) => ({
            ...prev,
            booking_code: data.data.booking_code || '',
          }));
        } else {
          setStatus('failed');
          setMessage(data.data?.message || getErrorMessage(params.vnp_ResponseCode));
        }
      } catch (e) {
        setStatus('error');
        setMessage('Có lỗi khi xử lý thanh toán');
      }
    };

    processPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const getErrorMessage = (code: string): string => {
    const errorMessages: Record<string, string> = {
      '07': 'Giao dịch bị nghi ngờ gian lận',
      '09': 'Thẻ chưa đăng ký dịch vụ',
      '10': 'Xác thực thông tin thẻ không chính xác',
      '11': 'Hết hạn chờ thanh toán',
      '12': 'Thẻ bị khóa',
      '13': 'Sai mật khẩu xác thực',
      '24': 'Giao dịch bị hủy',
      '51': 'Tài khoản không đủ số dư',
      '65': 'Vượt quá số lần nhập sai mật khẩu',
      '75': 'Ngân hàng bảo trì',
      '79': 'Giao dịch vượt hạn mức',
      'default': 'Giao dịch thất bại. Vui lòng thử lại sau.',
    };
    return errorMessages[code] || errorMessages['default'];
  };

  const renderStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'failed':
        return <XCircle className="w-16 h-16 text-red-500" />;
      case 'error':
        return <AlertCircle className="w-16 h-16 text-orange-500" />;
      default:
        return <Clock className="w-16 h-16 text-blue-500 animate-spin" />;
    }
  };

  const renderStatusColor = () => {
    switch (status) {
      case 'success':
        return 'border-green-500';
      case 'failed':
        return 'border-red-500';
      case 'error':
        return 'border-orange-500';
      default:
        return 'border-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className={`max-w-2xl w-full border-2 ${renderStatusColor()}`}>
        <CardHeader>
          <CardTitle className="text-center">
            <div className="flex justify-center mb-4">{renderStatusIcon()}</div>
            <h1 className="text-2xl font-bold">{message}</h1>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Transaction Details */}
          {Object.keys(details).length > 0 && (
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h3 className="font-semibold mb-2">Thông tin giao dịch:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {/* {details.vnp_TxnRef && (
                  <>
                    <span className="text-muted-foreground">Mã đơn hàng:</span>
                    <span className="font-medium">{details.vnp_TxnRef}</span>
                  </>
                )} */}
                {details.vnp_Amount && (
                  <>
                    <span className="text-muted-foreground">Số tiền:</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(parseInt(details.vnp_Amount) / 100)}
                    </span>
                  </>
                )}
                {details.vnp_BankCode && (
                  <>
                    <span className="text-muted-foreground">Ngân hàng:</span>
                    <span className="font-medium">{details.vnp_BankCode}</span>
                  </>
                )}
                {details.vnp_PayDate && (
                  <>
                    <span className="text-muted-foreground">Thời gian:</span>
                    <span className="font-medium">
                      {details.vnp_PayDate.replace(
                        /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
                        '$3/$2/$1 $4:$5:$6'
                      )}
                    </span>
                  </>
                )}
                {details.vnp_TransactionNo && (
                  <>
                    <span className="text-muted-foreground">Mã GD VNPAY:</span>
                    <span className="font-medium">{details.vnp_TransactionNo}</span>
                  </>
                )}
                {details.booking_code && (
                  <>
                    <span className="text-muted-foreground">Mã đặt vé:</span>
                    <span className="font-medium">{details.booking_code}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-center pt-4">
            {status === 'success' ? (
              <>
                <Button
                  onClick={() => router.push('/myticket')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Xem vé của tôi
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                >
                  Về trang chủ
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => router.push('/movies')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Đặt vé lại
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                >
                  Về trang chủ
                </Button>
              </>
            )}
          </div>

          {/* Debug Info (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4">
              <summary className="text-xs text-muted-foreground cursor-pointer">
                Debug Info (Dev only)
              </summary>
              <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-auto">
                {JSON.stringify(details, null, 2)}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Clock className="w-16 h-16 text-blue-500 animate-spin" />
        </div>
      }
    >
      <PaymentReturnContent />
    </Suspense>
  );
}
