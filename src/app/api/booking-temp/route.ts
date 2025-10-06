import { NextRequest, NextResponse } from 'next/server';

// Temporary storage (in production, use Redis or Database)
const bookingCache = new Map();

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();
    const bookingId = Date.now().toString();
    
    // Store booking data with expiry (10 minutes)
    bookingCache.set(bookingId, {
      data: bookingData,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    return NextResponse.json({ bookingId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save booking data' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('id');

    if (!bookingId || !bookingCache.has(bookingId)) {
      return NextResponse.json({ error: 'Booking data not found' }, { status: 404 });
    }

    const booking = bookingCache.get(bookingId);
    
    // Check if expired
    if (booking.expiresAt < Date.now()) {
      bookingCache.delete(bookingId);
      return NextResponse.json({ error: 'Booking data expired' }, { status: 404 });
    }

    return NextResponse.json(booking.data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get booking data' }, { status: 500 });
  }
}