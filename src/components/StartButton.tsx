// src/components/StartButton.tsx
import React from 'react';
import './StartButton.css'; // Ensure this path matches your setup

interface StartButtonProps {
  onStart: () => void;
}

const StartButton: React.FC<StartButtonProps> = ({ onStart }) => {
  return (
    <button className="start-button" onClick={onStart}>
      Start
    </button>
  );
};

export default StartButton;
