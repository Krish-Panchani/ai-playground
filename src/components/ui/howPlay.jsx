import React from 'react';

export default function HowPlay({ isPage }) {
  let content;
  switch (isPage) {
    case 'CreativeQuest':
      content = (
        <div className='flex flex-col items-start p-4 mb-4 border-2 border-orange-500 rounded-lg bg-gray-50'>
          <h2 className='text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent'>How to Play Creative Quest</h2>
          <ol className='list-decimal list-inside text-sm sm:text-base font-semibold'>
            <li>Click the "Generate Que" button to get an AI-generated question.</li>
            <li>Draw your answer to the question on the canvas below.</li>
            <li>Click "Submit" to upload your drawing to AI</li>
            <li>Correct Drawing = 1 to 10 Points, Incorrect Drawing = 1 Point</li>
          </ol>
        </div>
      );
      break;
    case 'ArtfulStories':
      content = (
        <div className='flex flex-col items-start p-4 mb-4 border-2 border-orange-500 rounded-lg bg-gray-50'>
          <h2 className='text-xl sm:text-2xl font-semibold mb-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent'>How to Play Artful Stories</h2>
          <ol className='list-decimal list-inside text-sm sm:text-base font-semibold'>
            <li>Draw your imagination on the Drawing Board.</li>
            <li>Add Additional Prompt or Instruction for AI.</li>
            <li>Click "Submit" to upload your drawing to AI</li>
            <li>AI will generate a creative and interesting story for you.</li>
          </ol>
        </div>
      );
      break;
    case 'ArtfulGuesswork':
      content = (
        <div className='flex flex-col items-start p-4 mb-4 border-2 border-orange-500 rounded-lg bg-gray-50'>
          <h2 className='text-xl sm:text-2xl font-semibold mb-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent'>How to Play Artful Guesswork</h2>
          <ol className='list-decimal list-inside text-sm sm:text-base font-semibold'>
            <li>Draw anything that comes to your mind.</li>
            <li>Add an additional hint for AI (optional).</li>
            <li>Click "Submit" to upload your drawing to AI</li>
            <li>AI will guess what you have drawn.</li>
          </ol>
        </div>
      );
      break;
    default:
      content = null;
  }

  return <div>{content}</div>;
}