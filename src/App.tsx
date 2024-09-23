// src/App.tsx
import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Box from './components/Box';
import InputField from './components/InputField';
import { kanjiData } from './kanjiData'; // Import the Kanji data

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

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const timerRefs = useRef<Array<NodeJS.Timeout | null>>(kanjiData.map(() => null));
  const overallTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start the overall timer when any box is interacted with for the first time
    if (!overallTimerRunning && completedCount > 0) {
      setOverallTimerRunning(true);
      overallTimerRef.current = setInterval(() => setOverallTimer((prev) => prev + 1), 1000);
    }

    // Stop the overall timer when all boxes are completed
    if (completedCount === kanjiData.length && overallTimerRunning) {
      clearInterval(overallTimerRef.current!);
      setOverallTimerRunning(false);
    }
  }, [completedCount, overallTimerRunning]);

  const handleFocus = (index: number) => {
    // Start the timer for the focused box
    if (timerRefs.current[index] === null) {
      timerRefs.current[index] = setInterval(() => {
        setBoxStatus((prevStatus) => {
          const updatedStatus = [...prevStatus];
          updatedStatus[index].timer += 1;
          return updatedStatus;
        });
      }, 1000);
    }
  };

  const handleBlur = (index: number) => {
    // Stop the timer when the box loses focus
    if (timerRefs.current[index] !== null) {
      clearInterval(timerRefs.current[index]!);
      timerRefs.current[index] = null;
    }
  };

  const handleInputSubmit = (index: number, isCorrect: boolean) => {
    const newStatus = [...boxStatus];
    if (isCorrect) {
      newStatus[index] = { ...newStatus[index], status: 'correct', showInput: false };
      handleBlur(index); // Stop timer when the answer is correct
      setCompletedCount((prev) => prev + 1); // Increment completed count
    } else {
      newStatus[index] = { ...newStatus[index], status: 'incorrect', showInput: true };
    }
    setBoxStatus(newStatus);

    // Automatically focus the next input field if correct
    if (isCorrect && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const progressPercentage = (completedCount / kanjiData.length) * 100;

  return (
    <div className="App">
      <header className="App-header">
        <div className="grid-container">
          {kanjiData.map((item, index) => (
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
              <Box word={item.kanji} />
              <div className="input-container">
                {boxStatus[index].showInput ? (
                  <InputField
                    correctWord={item.target}
                    onSubmit={(isCorrect) => handleInputSubmit(index, isCorrect)}
                    inputRef={(el) => (inputRefs.current[index] = el)}
                    onFocus={() => handleFocus(index)}
                    onBlur={() => handleBlur(index)}
                  />
                ) : (
                  <p className="correct-word">{item.target}</p>
                )}
              </div>
              <div className="timer-display">
                Time: {Math.floor(boxStatus[index].timer / 60)}:
                {String(boxStatus[index].timer % 60).padStart(2, '0')}
              </div>
            </div>
          ))}
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
    </div>
  );
}

export default App;
