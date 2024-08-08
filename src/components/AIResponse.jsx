import React, { useCallback } from 'react';


const AIResponse = React.memo(({ responseText, isPage }) => {
  const renderGuessResponse = useCallback((responseText) => {
    try {
      console.log(responseText);
      const response = JSON.parse(responseText);
      const { guess } = response;
      return (
        <div className='mt-4 border border-orange-300 p-4 rounded-lg text-white'>
          <p>🤔 <span className='text-white font-bold'>{guess}</span></p>
        </div>
      );
    } catch (error) {
      console.error('Error parsing response:', error);
      return <p>Invalid response format</p>;
    }
  }, []);

  const renderStoryResponse = useCallback((responseText) => {
    try {
      const response = JSON.parse(responseText);
      const { title, story } = response;
      return (
        <div className='mt-4 border border-orange-300 p-4 rounded-lg text-white'>
          <h2 className='text-xl px-2 py-2 font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent uppercase'>{title}</h2>
          <p><span className='text-white font-semibold px-2 py-2 text-justify whitespace-pre-line'>{story}</span></p>
        </div>
      );
    } catch (error) {
      console.error('Error parsing response:', error);
      return <p>Invalid response format</p>;
    }
  }, []);

  const renderQueResponse = useCallback((responseText) => {
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
  }, []);

  return (
    <div className='flex justify-center items-center text-white'>
      <div className='mt-4 p-4 rounded-lg'>
        <h3 className='text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent'>Gemini - Response</h3>
        {isPage === 'CreativeQuest' && renderQueResponse(responseText)}
        {isPage === 'ArtfulStories' && renderStoryResponse(responseText)}
        {isPage === 'ArtfulGuesswork' && renderGuessResponse(responseText)}
      </div>
    </div>
  );
});

export default AIResponse;
