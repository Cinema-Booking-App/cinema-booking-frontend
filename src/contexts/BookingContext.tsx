"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BookingContextType {
  bookingData: any;
  setBookingData: (data: any) => void;
  clearBookingData: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookingData, setBookingDataState] = useState<any>(null);

  const setBookingData = (data: any) => {
    setBookingDataState(data);
  };

  const clearBookingData = () => {
    setBookingDataState(null);
  };

  return (
    <BookingContext.Provider value={{ bookingData, setBookingData, clearBookingData }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};