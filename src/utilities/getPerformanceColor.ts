

export const getPerformanceColor = (percentage: number) => {
    if (percentage >= 50) {
      return 'performance-green-dark'; // Dark Green
    } else if (percentage < 20) {
      return 'performance-red-dark'; // Dark Red
    } else if (percentage < 30) {
      return 'performance-red-light'; // Light Red
    } else if (percentage < 40) {
      return 'performance-orange'; // Orange
    } else {
      return 'performance-yellow'; // Yellow
    }
  };