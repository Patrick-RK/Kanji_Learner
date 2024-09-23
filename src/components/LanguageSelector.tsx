// src/components/LanguageSelector.tsx
import React, { useState, useEffect } from 'react';
import './LanguageSelector.css';

interface LanguageSelectorProps {
  onLanguageChange: (column: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
  // Set the default selected language to 'Romaji' or any other preferred default
  const [selectedLanguage, setSelectedLanguage] = useState('Romaji');

  useEffect(() => {
    // Trigger the default language change when the component mounts
    onLanguageChange(selectedLanguage);
  }, [selectedLanguage, onLanguageChange]);

  const handleButtonClick = (column: string) => {
    setSelectedLanguage(column);
    onLanguageChange(column);
    console.log(`Selected column: ${column}`);
  };

  return (
    <div className="language-selector">
      <button
        className={`language-button ${selectedLanguage === 'Romaji' ? 'selected' : ''}`}
        onClick={() => handleButtonClick('Romaji')}
      >
        Romaji
      </button>
      <button
        className={`language-button ${selectedLanguage === 'Kana' ? 'selected' : ''}`}
        onClick={() => handleButtonClick('Kana')}
      >
        Kana
      </button>
      <button
        className={`language-button ${selectedLanguage === 'Kanji' ? 'selected' : ''}`}
        onClick={() => handleButtonClick('Kanji')}
      >
        Kanji
      </button>
    </div>
  );
};

export default LanguageSelector;
