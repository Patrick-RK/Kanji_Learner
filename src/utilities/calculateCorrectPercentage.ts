export const calculateCorrectPercentage = (attempts: number) => {
    return attempts === 1 ? 100 : Math.round((1 / attempts) * 100);
  };
