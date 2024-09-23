// src/components/InputField.tsx
import React, { useState } from 'react';

interface InputFieldProps {
  correctWord: string;
  onSubmit: (isCorrect: boolean) => void;
  inputRef?: React.Ref<HTMLInputElement>;
  onFocus: () => void;
  onBlur: () => void;
}

const InputField: React.FC<InputFieldProps> = ({ correctWord, onSubmit, inputRef, onFocus, onBlur }) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const isCorrect = inputValue.toLowerCase() === correctWord.toLowerCase();
      onSubmit(isCorrect);
      if (isCorrect) {
        setInputValue(''); // Clear input field after submission
        onBlur(); // Stop the timer when correct
      }
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder="Type the Kana..."
    />
  );
};

export default InputField;
