import React, { useState, useRef } from 'react';
import DrawingCanvas from '../components/DrawingCanvas';
import HowPlay from '../components/howPlay';
import Header from '../components/Header';
import Score from '../components/Score';
import AIResponse from '../components/AIResponse';
import { handleGenerateQuestion } from '../helpers/genQues';
import { handleDrawingComplete, handleUpload, handleSendPrompt } from '../helpers/handleUploadDrawing';
import Question from '../components/Question';

function Playground() {
    const [file, setFile] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [responseText, setResponseText] = useState('');
    const [question, setQuestion] = useState('');
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [loadingResponse, setLoadingResponse] = useState(false);
    const [loadingQuestion, setLoadingQuestion] = useState(false);
    const [score, setScore] = useState(0);
    const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
    const canvasRef = useRef(null);

    const handleAIResponse = (responseText) => {
        setResponseText(responseText);
    };

    return (
        <div className='flex flex-col min-h-screen bg-gray-100 p-4'>
            <Header
                handleGenerateQuestion={() => handleGenerateQuestion(setLoadingQuestion, setQuestion, setPrompt, canvasRef, setResponseText)}
                loadingQuestion={loadingQuestion}
                className='mb-4'
            />
            {!question &&
            <div>
                <h2 className='text-center text-xl sm:text-2xl my-4'>Welcome to <span className='font-bold'>AI Playground</span> - Where Creativity Meets Learning</h2>
            </div>
            }
            <div className='flex flex-col-reverse md:flex-row items-center justify-evenly gap-4 my-6'>
                <Question question={question} className='text-lg font-semibold text-gray-800' />
                <Score score={score}/>
            </div>
            <div className='flex flex-col items-center mb-6 space-y-4'>
                <AIResponse
                    loadingResponse={loadingResponse}
                    responseText={responseText}
                    onResponseGenerated={handleAIResponse}
                    className='w-full max-w-xl bg-white shadow-md rounded-lg p-4'
                />
                {question && (
                    <div className='flex flex-col items-center w-full space-y-4'>
                        <DrawingCanvas
                            ref={canvasRef}
                            onDrawingComplete={(dataUrl) => handleDrawingComplete(dataUrl, setFile)}
                            setIsCanvasEmpty={setIsCanvasEmpty}
                        />
                        <button
                            onClick={() => handleUpload(file, setLoadingUpload, handleSendPrompt, prompt, setResponseText, setLoadingResponse, setScore)}
                            className={`w-full px-6 py-3 text-white rounded-lg font-semibold transition-colors duration-300 ${isCanvasEmpty || responseText ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                            disabled={isCanvasEmpty || responseText}
                        >
                            {loadingUpload ? 'Uploading...' : 'Submit'}
                        </button>
                    </div>
                )}
            </div>
            <div className='flex justify-center'>
                <HowPlay className='text-center text-sm text-gray-700' />
            </div>
        </div>
    );
}


export default Playground;
