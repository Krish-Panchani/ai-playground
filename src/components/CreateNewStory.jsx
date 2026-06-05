import React from 'react'

import { showSuccess } from '../lib/toast';
import { useGameStore } from '../store/useGameStore';

const CreateNewStory = ({ onStartNew, canvasRef }) => {
    const handleNewBoard = () => {
        useGameStore.getState().resetStory();
        onStartNew?.();
        if (canvasRef.current) {
            canvasRef.current.clearCanvas();
        }
        showSuccess('Fresh canvas — your next drawing starts a new story.');
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