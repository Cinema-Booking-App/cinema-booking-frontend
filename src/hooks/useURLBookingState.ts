import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface URLBookingState {
  sessionId: string;
  selectedSeats: string[];
  ticketType: 'adult' | 'child' | 'student';
}

export const useURLBookingState = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);
  const [state, setState] = useState<URLBookingState>({
    sessionId: '',
    selectedSeats: [],
    ticketType: 'adult'
  });

  // Parse state từ URL
  const parseFromURL = useCallback((): URLBookingState => {
    const sessionId = searchParams.get('session') || '';
    const seats = searchParams.get('seats');
    const type = searchParams.get('type') as 'adult' | 'child' | 'student' || 'adult';

    return {
      sessionId,
      selectedSeats: seats ? seats.split(',').filter(Boolean) : [],
      ticketType: type
    };
  }, [searchParams]);

  // Update URL với state mới
  const updateURL = useCallback((newState: URLBookingState, replace = true) => {
    const params = new URLSearchParams(searchParams);
    
    // Set session ID
    if (newState.sessionId) {
      params.set('session', newState.sessionId);
    }
    
    // Set selected seats
    if (newState.selectedSeats.length > 0) {
      params.set('seats', newState.selectedSeats.join(','));
    } else {
      params.delete('seats');
    }
    
    // Set ticket type
    if (newState.ticketType !== 'adult') {
      params.set('type', newState.ticketType);
    } else {
      params.delete('type');
    }

    const newURL = `${window.location.pathname}?${params.toString()}`;
    
    if (replace) {
      router.replace(newURL, { scroll: false });
    } else {
      router.push(newURL, { scroll: false });
    }
  }, [router, searchParams]);

  // Initialize state từ URL hoặc tạo mới
  useEffect(() => {
    if (isInitialized) return;

    const urlState = parseFromURL();
    
    if (!urlState.sessionId) {
      // Tạo session mới nếu chưa có
      const newSessionId = uuidv4();
      const newState = {
        sessionId: newSessionId,
        selectedSeats: [],
        ticketType: 'adult' as const
      };
      
      setState(newState);
      updateURL(newState);
    } else {
      // Sử dụng state từ URL
      setState(urlState);
    }
    
    setIsInitialized(true);
  }, [isInitialized, parseFromURL, updateURL]);

  // Update state và sync với URL
  const updateState = useCallback((updates: Partial<URLBookingState>) => {
    const newState = { ...state, ...updates };
    setState(newState);
    updateURL(newState);
  }, [state, updateURL]);

  // Helper functions
  const selectSeat = useCallback((seatCode: string) => {
    const newSeats = state.selectedSeats.includes(seatCode)
      ? state.selectedSeats.filter(s => s !== seatCode)
      : [...state.selectedSeats, seatCode];
    
    updateState({ selectedSeats: newSeats });
  }, [state.selectedSeats, updateState]);

  const setTicketType = useCallback((type: 'adult' | 'child' | 'student') => {
    updateState({ ticketType: type });
  }, [updateState]);

  const clearSeats = useCallback(() => {
    updateState({ selectedSeats: [] });
  }, [updateState]);

  const resetSession = useCallback(() => {
    const newSessionId = uuidv4();
    updateState({
      sessionId: newSessionId,
      selectedSeats: [],
      ticketType: 'adult'
    });
  }, [updateState]);

  return {
    // State
    sessionId: state.sessionId,
    selectedSeats: state.selectedSeats,
    ticketType: state.ticketType,
    isInitialized,
    
    // Actions
    selectSeat,
    setTicketType,
    clearSeats,
    resetSession,
    updateState,
    
    // Computed
    hasSelectedSeats: state.selectedSeats.length > 0,
    selectedSeatsCount: state.selectedSeats.length
  };
};