// src/components/TimerDisplay.tsx
import React from 'react';

interface TimerDisplayProps {
  timer: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timer }) => {
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  return (
    <div className="timer-display">
      {minutes}:{String(seconds).padStart(2, '0')}
    </div>
  );
};

export default TimerDisplay;
