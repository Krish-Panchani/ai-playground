import React, { useState, useRef, useEffect } from 'react';
import DrawingCanvas from '../components/DrawingCanvas';
import HowPlay from '../components/howPlay';
import Header from '../components/Header';
import AIResponse from '../components/AIResponse';
import GenerateQuestionButton from '../components/GenerateQuestionButton';
import { handleGenerateQuestion } from '../helpers/genQues';
import { handleDrawingComplete, handleUpload, handleSendPrompt } from '../helpers/handleUploadDrawing';
import Question from '../components/Question';
import { auth, firestore } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import Login from '../components/Login';
import useAuth from '../auth/useAuth';

function Playground() {
    const [file, setFile] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [responseText, setResponseText] = useState('');
    const [question, setQuestion] = useState('');
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [loadingResponse, setLoadingResponse] = useState(false);
    const [loadingQuestion, setLoadingQuestion] = useState(false);
    const [score, setScore] = useState();
    const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
    const [ageGroup, setAgeGroup] = useState('');
    const [skillLevel, setSkillLevel] = useState('');
    const canvasRef = useRef(null);

    const user = useAuth(); // This should work fine here

    const signOut = () => {
        auth.signOut()
            .then(() => {
                console.log('User signed out successfully');
            })
            .catch((error) => {
                console.error('Error signing out: ', error);
            });
    };

    useEffect(() => {
        const fetchUserScore = async () => {
            if (user) {
                console.log('Fetching user score from Firestore: Playground');
                const userDocRef = doc(firestore, 'users', user.uid);
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setScore(data.score); // Set score from Firestore
                    console.log('User score - Playground:', data.score);
                } else {
                    console.log('Creating new user document in Firestore: Playground');
                    // New user, create document with initial score of 0
                    await setDoc(userDocRef, {
                        displayName: user.displayName,
                        email: user.email,
                        score: 0
                    });
                    setScore(0); // Set initial score for new users
                }
            } else {
                console.log('User not signed in: Playground');
                setScore(0); // Set score to 0 for guest user
            }
        };

        fetchUserScore();
    }, [user]);

    const handleAIResponse = (responseText) => {
        setResponseText(responseText);
    };

    const ageGroups = ['Junior Artist (Age: 12 and below)', 'Teen Artist (Age: between 13-19)', 'Adult Artist (Age: 20 and above)'];
    const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

    return (
        <div className='flex flex-col min-h-screen bg-black p-4'>
            <Header
                score={score}
                className='mb-4'
            />
            <div className='text-white flex items-center justify-between px-8 my-6'>
                {user ? (
                    <div className='flex items-center'>
                        <h2 className='text-lg sm:text-xl font-semibold mr-4'>
                            Hello Artist, <span className='font-bold'>{user.displayName}</span>
                        </h2>
                        <select
                            value={ageGroup}
                            onChange={(e) => setAgeGroup(e.target.value)}
                            className='bg-gray-700 text-white rounded px-2 py-1 mr-4' required>
                            <option value=''>Select Age Group</option>
                            {ageGroups.map(group => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                        </select>
                        <select
                            value={skillLevel}
                            onChange={(e) => setSkillLevel(e.target.value)}
                            className='bg-gray-700 text-white rounded px-2 py-1 mr-4' required>
                            <option value=''>Select Skill Level</option>
                            {skillLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                        <button
                            onClick={signOut}
                            className='px-4 py-2 bg-red-600 rounded text-white'>
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className='text-md sm:text-xl font-semibold'>
                            Hello Artist, <span className='font-bold'>Guest</span>
                        </h2>
                        <div>
                            <label className='text-white px-2'>I'am</label>
                            <select
                                value={ageGroup}
                                onChange={(e) => setAgeGroup(e.target.value)}
                                className='bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 mr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                                required
                            >
                                {ageGroups.map(group => (
                                    <option key={group} value={group} className='bg-white text-black'>{group}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className='text-white px-2'>My Skill Level</label>
                            <select
                                value={skillLevel}
                                onChange={(e) => setSkillLevel(e.target.value)}
                                className='bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 mr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                                required
                            >
                                {skillLevels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>
                        <Login setQuestion={setQuestion} setResponseText={setResponseText} />
                    </>
                )}
            </div>
            {!question &&
                <div>
                    <h2 className='text-center text-xl sm:text-2xl my-4 text-white'>
                        Welcome to <span className='font-bold'>AI Playground</span> - Where Creativity Meets Learning
                    </h2>
                </div>
            }
            <div className='flex flex-col md:flex-row items-center justify-stretch mx-auto gap-4 my-6'>
                <GenerateQuestionButton
                    handleGenerateQuestion={() => handleGenerateQuestion(setLoadingQuestion, setQuestion, setPrompt, ageGroup, skillLevel, canvasRef, setResponseText)}
                    loadingQuestion={loadingQuestion}
                    question={question}
                />
                {question
                    ?
                    <Question question={question} className='text-lg font-semibold text-gray-800' />
                    :
                    <div className='text-lg font-semibold text-gray-600'>
                        Click Generate Question Button to get Question.
                    </div>}
                {loadingQuestion &&
                    <div className="h-1 w-60 mb-4 bg-gradient-to-r from-cyan-400 to-green-500 mx-auto rounded-full animate-gradient-animate z-50"></div>
                }
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
                            onClick={() => handleUpload(file, setLoadingUpload, handleSendPrompt, prompt, setResponseText, setLoadingResponse, setScore, user)}
                            className={`w-full px-6 py-3 text-white rounded-lg font-semibold transition-colors duration-300 ${isCanvasEmpty || responseText ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-400 to-cyan-400'}`}
                            disabled={isCanvasEmpty || responseText}
                        >
                            {loadingUpload ? 'Uploading...' : 'Submit'}
                        </button>
                    </div>
                )}
            </div>
            {!question && (
                <div className='flex justify-center'>
                    <HowPlay className='text-center text-sm text-gray-700' />
                </div>
            )}
        </div>
    );
}

export default Playground;
