import React, { useState, useEffect } from 'react';

const GenerateQuestionButton = ({ handleGenerateQuestion, loadingQuestion, question }) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const handleButtonClick = async () => {
    setIsButtonDisabled(true);
    setRemainingTime(120); // 2 minutes in seconds
    await handleGenerateQuestion();
  };

  useEffect(() => {
    let timer;
    if (remainingTime > 0 && isButtonDisabled) {
      timer = setInterval(() => {
        setRemainingTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      setIsButtonDisabled(false);
    }

    // Cleanup interval on component unmount or when timer is done
    return () => clearInterval(timer);
  }, [remainingTime, isButtonDisabled]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <button 
      onClick={handleButtonClick} 
      className={isButtonDisabled ? 'text-xl font-semibold px-4 py-2 text-white rounded-lg cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 text-white font-semibold rounded-full  whitespace-nowrap'}
      disabled={loadingQuestion || isButtonDisabled}
    >
      {loadingQuestion ? 'Loading...' : (isButtonDisabled ? `Retry in ${formatTime(remainingTime)}` : (question ? 'Next' : 'Generate Que'))}
      
    </button>
  );
};

export default GenerateQuestionButton;
