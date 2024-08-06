import React from 'react';
import { doc, setDoc, getDoc, addDoc, collection} from 'firebase/firestore';
import { firestore } from '../firebase';
const Feedback = ({ setResponseText, canvasRef, setIsFeedback, file }) => {
    const handleNewBoard = () => {
        setResponseText('');
        if (canvasRef.current) {
            canvasRef.current.clearCanvas();
        }
    };
    const handleFeedback =  (feedback) => async () => {
        setResponseText('');
        if (canvasRef.current) {
            canvasRef.current.clearCanvas();
        }
        if (feedback === 'Correct!') {
            setIsFeedback('Correct!');
            const userDocRef = doc(firestore, 'ArtfulGuesswork');
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const fileName = userDoc.data().filename;
                if (fileName === file) {
                    await setDoc(userDocRef, { isCorrect: true }, { merge: true });
                }
            }
        }
        else {
            setIsFeedback('InCorrect!');
        }
    }

    return (
        <div className='flex items-center gap-2'>
            <button 
            onClick={handleFeedback("Correct!")}
            className='bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 text-white font-semibold rounded-full whitespace-nowrap'>Correct!</button>
            <button 
            onClick={handleFeedback("InCorrect!")}
            className='bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 text-white font-semibold rounded-full whitespace-nowrap'>InCorrect!</button>
            <button 
                onClick={handleNewBoard}
                className='bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 text-white font-semibold rounded-full whitespace-nowrap'>New</button>
        </div>
    );
};

export default Feedback;
