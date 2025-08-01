'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import './globals.css'; // Import your global CSS file
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// --- CONFIGURATION OBJECT FOR DYNAMIC ROLE-BASED ACCESS ---
// Đối tượng này ánh xạ các đường dẫn tới các vai trò cần thiết.
const routePermissions = {
  '/dashboard': ['user'],
  '/admin': ['admin'],
  '/admin/movies': ['admin'],
};

// Mock function to simulate decoding a JWT token
const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // This runs only on the client side
    const accessToken = localStorage.getItem('accessToken');
    const requiredRoles = routePermissions[pathname] || [];

    if (requiredRoles.length > 0 && !accessToken) {
      router.push('/login');
    } else if (accessToken) {
      const userPayload = decodeToken(accessToken);
      const userRoles = userPayload?.roles || [];
      const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));

      if (requiredRoles.length > 0 && !hasRequiredRole) {
        router.push('/access-denied');
      } else {
        setIsReady(true);
      }
    } else {
      setIsReady(true);
    }
  }, [router, pathname]);

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4">
        <h1 className="text-2xl font-bold mb-4">Đang kiểm tra quyền truy cập...</h1>
        <p className="text-lg">Nếu không có token hoặc quyền phù hợp, bạn sẽ được chuyển hướng.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {/* AuthGuard wraps the entire application content */}
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
