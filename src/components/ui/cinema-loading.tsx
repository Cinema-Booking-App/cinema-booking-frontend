import React from 'react';

const LoadingComponent = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50"
    style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền đen trong suốt 50%
      }}>
      <div className="relative flex flex-col items-center">
        {/* Loading Animation */}
        <div className="relative w-20 h-20">
          {/* Rotating film reel effect */}
          <div className="absolute inset-0 border-4 border-t-transparent border-red-600 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-t-transparent border-yellow-400 rounded-full animate-spin animation-delay-150"></div>
          {/* Film strip icons */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingComponent;