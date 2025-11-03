'use client';
import { useEffect } from "react";
import Footer from "@/components/client/layouts/footer";
import Header from "@/components/client/layouts/header";
import { initializeAuth, logout, setUser } from "@/store/slices/auth/authSlide";
import { User } from "@/types/user";
import { useAppDispatch } from "@/store/store";
import { decodeJwt } from "@/utils/jwt";
import { useGetCurrentUserQuery } from "@/store/slices/auth/authApi";

const getFromLocalStorage = (): { token: string | null } => {
  try {
    const token = localStorage.getItem('token');
    return {
      token
    };
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return { token: null};
  }
};
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { token } = getFromLocalStorage();
  const { data: userData, isSuccess } = useGetCurrentUserQuery(undefined, { skip: !token });

  useEffect(() => {
    if (token) {
      const payload = decodeJwt(token);
      if (payload && payload.exp && payload.exp * 1000 < Date.now()) {
        dispatch(logout());
        return;
      }
      dispatch(initializeAuth({ token }));
    } else {
      dispatch(initializeAuth({ token: null }));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (isSuccess && userData) {
      dispatch(setUser({
        ...userData,
        status: userData.status as User['status']
      }));
    }
  }, [isSuccess, userData, dispatch]);

  return <>
    <Header />
    {children}
    <Footer />
  </>;
}