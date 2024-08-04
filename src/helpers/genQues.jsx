import { firebaseApp } from "../firebase";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai-preview";
const vertexAI = getVertexAI(firebaseApp);
const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash-001" });

export const handleGenerateQuestion = async (setLoadingQuestion, setQuestion, setPrompt, ageGroup, skillLevel, canvasRef, setResponseText) => {
    setLoadingQuestion(true);

    try {
      const prompt = `Generate only one easy Question that Ask user to draw something that can be drawn on Canvas of webpage.\n\n
      based on the user's age group (${ageGroup}) and skill level (${skillLevel}). \n\n
      It can be Alphabets, Numbers, Shapes, Objects, Animals, Birds, Fruits, Vegetables, Vehicles, etc.\n\n
      question should be Unique every time. also ask to draw only one object at a time if skill level is Beginner\n\n
      Example 1. Draw a house.
      Example 2. Draw a cat.
      Example 3. Draw a Number 2.
      `;
      console.log(prompt);


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
