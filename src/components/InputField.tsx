// src/components/InputField.tsx
import React, { useState, useRef } from 'react';

interface InputFieldProps {
  item: { [key: string]: string | undefined }; // Allow undefined properties
  onSubmit: (isCorrect: boolean) => void;
  inputRef: (el: HTMLInputElement | null) => void;
  onFocus: () => void;
  onBlur: () => void;
  inputLanguage: string; // Specifies which column to use for the correct answer
}

const InputField: React.FC<InputFieldProps> = ({
  item,
  onSubmit,
  inputRef,
  onFocus,
  onBlur,
  inputLanguage,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputElementRef = useRef<HTMLInputElement | null>(null);

  // Safely retrieve the correct word and coerce undefined to an empty string
  const correctWord = item[inputLanguage]?.trim() || '';

  console.log(`Correct Word: '${correctWord}'`); // Debugging output

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const isCorrect = inputValue.trim().toLowerCase() === correctWord.toLowerCase();
      onSubmit(isCorrect);
      setInputValue('');
    }
  };

  return (
    <input
      type="text"
      ref={(el) => {
        inputRef(el);
        inputElementRef.current = el;
      }}
      value={inputValue}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
      onFocus={onFocus}
      onBlur={onBlur}
      className="input-field"
      placeholder={`Enter ${inputLanguage}`}
    />
  );
};

export default InputField;
