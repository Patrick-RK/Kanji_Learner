// src/components/Box.tsx
import React from 'react';

interface BoxProps {
  word: string;
}

const Box: React.FC<BoxProps> = ({ word }) => {
  return <div className="kanji-display">{word}</div>;
};

export default Box;
