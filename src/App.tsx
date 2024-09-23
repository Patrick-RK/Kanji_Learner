// src/App.tsx
import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Box from './components/Box';
import InputField from './components/InputField';
import StartButton from './components/StartButton';
import LanguageSelector from './components/LanguageSelector';
import { kanjiData } from './kanjiData'; // Ensure your CSV data includes Romaji, Kana, Kanji columns

interface BoxStatus {
  status: string;
  showInput: boolean;
  timer: number;
}

function App() {
  const [boxStatus, setBoxStatus] = useState<BoxStatus[]>(
    kanjiData.map(() => ({ status: '', showInput: true, timer: 0 }))
  );
  const [overallTimer, setOverallTimer] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [overallTimerRunning, setOverallTimerRunning] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState('Romaji'); // Default column set to 'Romaji'

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const timerRefs = useRef<Array<NodeJS.Timeout | null>>(kanjiData.map(() => null));
  const overallTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to start the overall timer
  const startOverallTimer = () => {
    setOverallTimerRunning(true);
    overallTimerRef.current = setInterval(() => setOverallTimer((prev) => prev + 1), 1000);
  };

  // Function to stop the overall timer
  const stopOverallTimer = () => {
    clearInterval(overallTimerRef.current!);
    setOverallTimerRunning(false);
  };

  useEffect(() => {
    // Stop the timer if all items are completed
    if (completedCount === kanjiData.length && overallTimerRunning) {
      stopOverallTimer();
    }
  }, [completedCount, overallTimerRunning]);

  const handleFocus = (index: number) => {
    if (timerRefs.current[index] === null) {
      timerRefs.current[index] = setInterval(() => {
        setBoxStatus((prevStatus) => {
          const updatedStatus = [...prevStatus];
          updatedStatus[index].timer += 10;
          return updatedStatus;
        });
      }, 10);
    }
  };

  const handleBlur = (index: number) => {
    if (timerRefs.current[index] !== null) {
      clearInterval(timerRefs.current[index]!);
      timerRefs.current[index] = null;
    }
  };

  const handleInputSubmit = (index: number, isCorrect: boolean) => {
    console.log(`Submitted: ${isCorrect ? 'Correct' : 'Incorrect'}`);
    const newStatus = [...boxStatus];
    if (isCorrect) {
      newStatus[index] = { ...newStatus[index], status: 'correct', showInput: false };
      handleBlur(index);
      setCompletedCount((prev) => prev + 1);
    } else {
      newStatus[index] = { ...newStatus[index], status: 'incorrect', showInput: true };
    }
    setBoxStatus(newStatus);

    if (isCorrect && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const progressPercentage = (completedCount / kanjiData.length) * 100;

  const handleStart = () => {
    setIsStarted(true); // Set the app to started
    startOverallTimer(); // Start the overall timer when the game starts
  };

  const handleLanguageChange = (column: string) => {
    setSelectedColumn(column); // Update the selected column state
    console.log(`Selected language column: ${column}`); // Debug log for column change
  };

  return (
    <div className="App">
      {!isStarted ? (
        <>
          <StartButton onStart={handleStart} /> {/* Start button */}
          <LanguageSelector onLanguageChange={handleLanguageChange} /> {/* Language selector */}
        </>
      ) : (
        <>
          <header className="App-header">
            <div className="grid-container">
              {kanjiData.map((item, index) => {
                // Ensure that Kanji is always a string
                const kanjiWord = item.Kanji || '';

                return (
                  <div
                    key={index}
                    className={`box-with-input ${
                      boxStatus[index].status === 'correct'
                        ? 'correct'
                        : boxStatus[index].status === 'incorrect'
                        ? 'incorrect'
                        : ''
                    }`}
                  >
                    <Box word={kanjiWord} /> {/* Ensure Kanji is always passed as a string */}
                    <div className="input-container">
                      {boxStatus[index].showInput ? (
                        <InputField
                          item={item} // Pass the entire item object
                          onSubmit={(isCorrect) => handleInputSubmit(index, isCorrect)}
                          inputRef={(el) => (inputRefs.current[index] = el)}
                          onFocus={() => handleFocus(index)}
                          onBlur={() => handleBlur(index)}
                          inputLanguage={selectedColumn} // Pass the selected language column
                        />
                      ) : (
                        <p className="correct-word">{item[selectedColumn as keyof typeof item]}</p>
                      )}
                    </div>
                    <div className="timer-display">
                      {Math.floor(boxStatus[index].timer / 60000)}:
                      {String(Math.floor((boxStatus[index].timer % 60000) / 1000)).padStart(2, '0')}:
                      {String(boxStatus[index].timer % 1000).padStart(3, '0')}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="info-row">
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="overall-timer">
                Time Elapsed: {Math.floor(overallTimer / 60)}:{String(overallTimer % 60).padStart(2, '0')}
              </div>
            </div>
          </header>
        </>
      )}
    </div>
  );
}

export default App;
