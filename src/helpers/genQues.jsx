import { firebaseApp } from "../firebase";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai-preview";
const vertexAI = getVertexAI(firebaseApp);
const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });

export const handleGenerateQuestion = async (setLoadingQuestion, setQuestion, setPrompt, canvasRef, setResponseText) => {
    setLoadingQuestion(true);

    try {
        // const response = await fetch(process.env.REACT_APP_GENERATE_QUESTION_URL);
        // if (!response.ok) {
        //     const errorData = await response.json();
        //     throw new Error(errorData.error || 'Error generating question');
        // }
        const prompt = `Please generate a unique drawing question for a user to draw something on a webpage canvas. The question should ask the user to draw something from various categories such as letters, numbers, shapes, objects, animals, birds, fruits, vegetables, vehicles, etc. Each question should be different and unique every time. Here are some examples of what you might ask: "Draw a house.", "Draw a cat.", "Draw a number 2.", "Draw a sun.", "Draw a bicycle." Make sure the question is always new and varied. generate only 1 question.`;


        // To generate text output, call generateContent with the text input
        const result = await model.generateContent(prompt);

        const response = result.response;
        console.log(response.text());

        const questionText = await response.text();
        setQuestion(questionText);
        setPrompt(questionText);
        setResponseText(''); // Clear the responseText here
        setLoadingQuestion(false);

        if (canvasRef.current) {
            canvasRef.current.clearCanvas();
        }
    } catch (error) {
        console.error('Error generating question:', error);
        alert('Error generating question: ' + error.message);
        setLoadingQuestion(false);
    }
};
