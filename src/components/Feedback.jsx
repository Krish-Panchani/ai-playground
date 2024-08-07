import React from 'react';
import { doc, setDoc, getDocs, query, where, collection } from 'firebase/firestore';
import { firestore } from '../firebase';

const Feedback = ({ setResponseText, canvasRef, setIsFeedback, uniqueFileName }) => {
    const correctFeedback = [
        "Nice! Let's try another one!",
        "Great job, AI! Ready for the next?",
        "Spot on! Let's keep going!",
        "AI got it right! On to the next one!",
        "Correct! Let's see the next guess.",
        "Well done, AI! What's next?"
    ];

    const incorrectFeedback = [
        "Not quite, AI! Give it another shot.",
        "Oops, AI! Try again.",
        "Missed it, AI. Let's try the next one.",
        "Wrong guess, AI! Keep trying.",
        "AI didn't get it this time. Next!",
        "Incorrect, AI. Let's move on."
    ];

    const getRandomFeedback = (feedbackArray) => {
        const randomIndex = Math.floor(Math.random() * feedbackArray.length);
        return feedbackArray[randomIndex];
    };

    const handleNewBoard = () => {
        setResponseText('');
        if (canvasRef.current) {
            canvasRef.current.clearCanvas();
        }
    };

    const handleFeedback = (isCorrect) => async () => {
        const feedbackMessage = isCorrect
            ? getRandomFeedback(correctFeedback)
            : getRandomFeedback(incorrectFeedback);

        setIsFeedback(feedbackMessage);

        try {
            // Query for the document with the matching file name
            const responseCollectionRef = collection(firestore, 'ArtfulGuesswork');
            const q = query(responseCollectionRef, where('file', '==', uniqueFileName));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Document found, update the isCorrect field
                const docRef = doc(firestore, 'ArtfulGuesswork', querySnapshot.docs[0].id);
                await setDoc(docRef, { isCorrect }, { merge: true });
                console.log("Document updated successfully");
            } else {
                console.log("No document found with the matching file name");
            }
        } catch (error) {
            console.error("Error updating document:", error);
            alert("Error updating document: " + error.message);
        }
        setTimeout(() => {
            setIsFeedback('');
        }, 3000);
        
        setResponseText('');
        if (canvasRef.current) {
            canvasRef.current.clearCanvas();
        }
    };

    return (
        <div className='flex items-center gap-2'>
            <button 
                onClick={handleFeedback(true)}
                className='bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 text-white font-semibold rounded-full whitespace-nowrap'>Correct!</button>
            <button 
                onClick={handleFeedback(false)}
                className='bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 text-white font-semibold rounded-full whitespace-nowrap'>Incorrect!</button>
            <button 
                onClick={handleNewBoard}
                className='bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 text-white font-semibold rounded-full whitespace-nowrap'>New</button>
        </div>
    );
};

export default Feedback;