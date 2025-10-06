import BookingClientWrapper from "@/components/client/booking/booking-client-wrapper";
import BookingDebug from "@/components/debug/BookingDebug";
import React from "react";

export default function BookingPage() {
  return (
    <>
      <BookingClientWrapper />
      {process.env.NODE_ENV === 'development' && <BookingDebug />}
    </>
  );
}