import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookingState {
  movieId: string | null;
  movieTitle: string | null;
  theaterId: string | null;
  theaterName: string | null;
  theaterAddress: string | null;
  showDate: string | null;
  showTime: string | null;
  format: string | null;
  ticketPrice: number | null;
  roomId: string | null;
}

// Load initial state from sessionStorage
const loadFromSessionStorage = (): BookingState => {
  if (typeof window !== 'undefined') {
    try {
      const savedState = sessionStorage.getItem('bookingData');
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (error) {
      console.error('Error loading booking data from sessionStorage:', error);
    }
  }
  
  return {
    movieId: null,
    movieTitle: null,
    theaterId: null,
    theaterName: null,
    theaterAddress: null,
    showDate: null,
    showTime: null,
    format: null,
    ticketPrice: null,
    roomId: null,
  };
};

const initialState: BookingState = loadFromSessionStorage();

// Save to sessionStorage helper
const saveToSessionStorage = (state: BookingState) => {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('bookingData', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving booking data to sessionStorage:', error);
    }
  }
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingData: (state, action: PayloadAction<Partial<BookingState>>) => {
      const newState = { ...state, ...action.payload };
      saveToSessionStorage(newState);
      return newState;
    },
    clearBookingData: (state) => {
      const clearedState = {
        movieId: null,
        movieTitle: null,
        theaterId: null,
        theaterName: null,
        theaterAddress: null,
        showDate: null,
        showTime: null,
        format: null,
        ticketPrice: null,
        roomId: null,
      };
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('bookingData');
      }
      return clearedState;
    },
  },
});

export const { setBookingData, clearBookingData } = bookingSlice.actions;
export default bookingSlice.reducer;