// src/App.tsx
import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Box from './components/Box';
import InputField from './components/InputField';
import StartButton from './components/StartButton';
import LanguageSelector from './components/LanguageSelector';
import SummaryBox from './components/SummaryBox';
import TimerDisplay from './components/TimerDisplay';
import { kanjiData } from './kanjiData';
import { getPerformanceColor } from './utilities/getPerformanceColor';

interface BoxStatus {
  status: string;
  showInput: boolean;
  timer: number;
  attempts: number; // Track the number of attempts for each box
}

function App() {
  const [boxStatus, setBoxStatus] = useState<BoxStatus[]>(
    kanjiData.map(() => ({ status: '', showInput: true, timer: 0, attempts: 0 }))
  );
  const [overallTimer, setOverallTimer] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [overallTimerRunning, setOverallTimerRunning] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState('Romaji');

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const timerRefs = useRef<Array<NodeJS.Timeout | null>>(kanjiData.map(() => null));
  const overallTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startOverallTimer = () => {
    setOverallTimerRunning(true);
    overallTimerRef.current = setInterval(() => setOverallTimer((prev) => prev + 1), 1000);
  };

  const stopOverallTimer = () => {
    clearInterval(overallTimerRef.current!);
    setOverallTimerRunning(false);
  };

  useEffect(() => {
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
    const newStatus = [...boxStatus];
    newStatus[index].attempts += 1;

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
    setIsStarted(true);
    startOverallTimer();
  };

  const handleLanguageChange = (column: string) => {
    setSelectedColumn(column);
  };



  function calculateCorrectPercentage(attempts: number): number {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="App">
      {!isStarted ? (
        <>
          <StartButton onStart={handleStart} />
          <LanguageSelector onLanguageChange={handleLanguageChange} />
        </>
      ) : (
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
                <Box word={item.Kanji || ''} />
                <div className="input-container">
                  {boxStatus[index].showInput ? (
                    <InputField
                      item={item}
                      onSubmit={(isCorrect) => handleInputSubmit(index, isCorrect)}
                      inputRef={(el) => (inputRefs.current[index] = el)}
                      onFocus={() => handleFocus(index)}
                      onBlur={() => handleBlur(index)}
                      inputLanguage={selectedColumn}
                    />
                  ) : (
                    <SummaryBox
                      item={item}
                      attempts={boxStatus[index].attempts}
                      completedCount={completedCount}
                      selectedColumn={selectedColumn}
                      totalItems={kanjiData.length}
                      calculateCorrectPercentage={calculateCorrectPercentage}
                      getPerformanceColor={getPerformanceColor}
                    />
                  )}
                </div>
                <TimerDisplay timer={boxStatus[index].timer} />
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
      )}
    </div>
  );
}

export default App;
