// src/components/SummaryBox.tsx
import React from 'react';
import './SummaryBox.css'; 

interface SummaryBoxProps {
  item: { [key: string]: string };
  attempts: number;
  completedCount: number;
  totalItems: number;
  selectedColumn: string;
  calculateCorrectPercentage: (attempts: number) => number;
  getPerformanceColor: (percentage: number) => string;
}

const SummaryBox: React.FC<SummaryBoxProps> = ({
  item,
  attempts,
  completedCount,
  totalItems,
  selectedColumn,
  calculateCorrectPercentage,
  getPerformanceColor,
}) => {
  // Calculate the percentage based on attempts
  const percentage = calculateCorrectPercentage(attempts);

  // Get the performance color class for text based on percentage
  const performanceColorClass = getPerformanceColor(percentage);

  // Map the performance color to the correct fill class for the progress bar
  const fillColorClass = `performance-fill-${performanceColorClass.split('-').slice(1).join('-')}`;

  return (
    <div className="summary">
      <p className={`correct-word ${performanceColorClass}`}>
        {completedCount === totalItems
          ? `Attempts: ${attempts}`
          : item[selectedColumn]}
      </p>
      {completedCount === totalItems && (
        <div className="percentage-bar-container">
          <div className="percentage-bar">
            <div
              className={`percentage-fill ${fillColorClass}`}
              style={{
                width: `${percentage}%`,
              }}
            ></div>
          </div>
          <span className={`percentage-value ${performanceColorClass}`}>
            {percentage}%
          </span>
        </div>
      )}
    </div>
  );
};

export default SummaryBox;
