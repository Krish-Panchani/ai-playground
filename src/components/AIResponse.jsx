import React from 'react';

const AIResponse = ({ loadingResponse, responseText, isCanvasEmpty, isPage }) => {

  const renderGuessResponse = () => {
    try{
      const response = JSON.parse(responseText);
      const { guess } = response;
      return (
        <div className='mt-4 border border-green-300 p-4 rounded-lg text-white'>
          <p><span className='text-green-600 font-bold'>{guess}</span></p>
        </div>
      );
    }
    catch (error) {
      console.error('Error parsing response:', error);
      return <p>Invalid response format</p>;
    }
  };
  const renderStoryResponse = () => {
    try{
      const response = JSON.parse(responseText);
      const { title, story } = response;
      return (
        <div className='mt-4 border border-green-300 p-4 rounded-lg text-white'>
          <h2>{title}</h2>
          <p><span className='text-green-600 font-bold'>{story}</span></p>
        </div>
      );
    }
    catch (error) {
      console.error('Error parsing response:', error);
      return <p>Invalid response format</p>;
    }
  };

  const renderQueResponse = () => {
    try {
      const response = JSON.parse(responseText);
      const { isCorrect, reason, points } = response;

      if (isCorrect) {
        return (
          <div className='mt-4 border border-green-300 p-4 rounded-lg text-white'>
            <p><span className='text-green-600 font-bold'>Correct!</span> {reason}</p>
            <p>Points: +{points}</p>
          </div>
        );
      } else {
        return (
          <div className='mt-4 border border-red-300 p-4 rounded-lg text-white'>
            <p><span className='text-red-600 font-bold'>Incorrect!</span> {reason}</p>
            <p>Points: {points}</p>
          </div>
        );
      }
    } catch (error) {
      console.error('Error parsing response:', error);
      return <p>Invalid response format</p>;
    }
  };

  return (
    <div className='flex justify-center items-center text-white'>
      {loadingResponse && <p>Loading AI response...</p>}
      {responseText && !isCanvasEmpty && (
        <div className='mt-4 p-4 rounded-lg'>
          <h3 className='text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent'>Gemini - Response</h3>
          
          {isPage === 'CreativeQuest' && renderQueResponse()}
          {isPage === 'ArtfulStories' && renderStoryResponse()}
          {isPage === 'ArtfulGuesswork' && renderGuessResponse}

        </div>
      )}
    </div>
  );
};

export default AIResponse;
