import React from 'react'

const CreateNewStory = ({ setResponseText, canvasRef }) => {
    const handleNewBoard = () => {
        setResponseText('');
        if (canvasRef.current) {
            canvasRef.current.clearCanvas();
        }
    };
    return (
        <div>
            <button 
                onClick={handleNewBoard}
                className='bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 text-white font-semibold rounded-full whitespace-nowrap'>Draw and Create New Story</button>
        </div>
    )
}

export default CreateNewStory;