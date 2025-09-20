'use client';
import { useEffect } from "react";
import Footer from "@/components/client/layouts/footer";
import Header from "@/components/client/layouts/header";
import { initializeAuth } from "@/store/slices/auth/authSlide";
import { User } from "@/types/user";
import { useAppDispatch } from "@/store/store";

const getFromLocalStorage = (): { token: string | null; user: User | null } => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return {
      token,
      user: user ? JSON.parse(user) : null,
    };
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return { token: null, user: null };
  }
};
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const { token, user } = getFromLocalStorage();
    dispatch(initializeAuth({ token, user }));
  }, [dispatch]);

  return <>
    <Header />
    {children}
    <Footer />
  </>;
} 