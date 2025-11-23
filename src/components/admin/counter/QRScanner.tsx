import React, { useEffect, useRef } from 'react';

interface QRScannerProps {
  onScan: (data: string | null) => void;
  onError?: (err: any) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError }) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrcodeScannerRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;
    if (typeof window === 'undefined' || !scannerRef.current) return;

    import('html5-qrcode').then(({ Html5Qrcode }) => {
      if (!isMounted || !scannerRef.current) return;
      const html5Qr = new Html5Qrcode(scannerRef.current.id);
      html5QrcodeScannerRef.current = html5Qr;
      html5Qr.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText: string) => {
          onScan(decodedText);
        },
        (err: any) => {
          if (onError) onError(err);
        }
      ).catch((err: any) => {
        if (onError) onError(err);
      });
    });
    return () => {
      isMounted = false;
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current.stop().then(() => {
          html5QrcodeScannerRef.current.clear();
        });
      }
    };
  }, [onScan, onError]);

  return (
    <div className="w-full flex flex-col items-center">
      <div id="qr-scanner" ref={scannerRef} style={{ width: 300, height: 300 }} />
    </div>
  );
};

export default QRScanner;
