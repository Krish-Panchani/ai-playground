import React from 'react';

export default function HowPlay({ isPage }) {
    return (
        <>
        {isPage === "CreativeQuest" && (
        <div className='flex flex-col items-start p-4 mb-4 border-2 border-orange-500 rounded-lg bg-gray-50'>
          <h2 className='text-2xl font-semibold mb-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent'>How to Play Creative Quest</h2>
          <ol className='list-decimal list-inside'>
            <li>Click the "Generate Que" button to get an AI-generated question.</li>
            <li>Draw your answer to the question on the canvas below.</li>
            <li>Click "Submit" to upload your drawing to AI</li>
            <li>Correct Drawing = 1 to 10 Points, Incorrect Drawing = 1 Point</li>
          </ol>
        </div>
        )}
        {isPage === "ArtfulStories" && (
        <div className='flex flex-col items-start p-4 mb-4 border-2 border-orange-500 rounded-lg bg-gray-50'>
          <h2 className='text-2xl font-semibold mb-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent'>How to Play Artful Stories</h2>
          <ol className='list-decimal list-inside'>
            <li>Draw you imagination on Drawing Board.</li>
            <li>Add Additional Prompt or Instruction for AI.</li>
            <li>Click "Submit" to upload your drawing to AI</li>
            <li>AI will generate a Creative interesting Story for you.</li>
          </ol>
        </div>
        )}
        {isPage === "ArtfulGuesswork" && (
        <div className='flex flex-col items-start p-4 mb-4 border-2 border-orange-500 rounded-lg bg-gray-50'>
          <h2 className='text-2xl font-semibold mb-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent'>How to Play Artful Guesswork</h2>
          <ol className='list-decimal list-inside'>
            <li>Draw anything that in your mind.</li>
            <li>Add Additional Hint for AI. (Optional)</li>
            <li>Click "Submit" to upload your drawing to AI</li>
            <li>AI will Guess what you drawn.</li>
          </ol>
        </div>
         )}
        </>
    )
}