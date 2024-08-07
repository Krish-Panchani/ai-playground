import { firebaseApp } from "../firebase";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai-preview";
const vertexAI = getVertexAI(firebaseApp);
const model = getGenerativeModel(vertexAI, { 
    model: "gemini-1.5-pro-001",
 });

export const handleGenerateQuestion = async (setLoadingQuestion, setQuestion, setPrompt, ageGroup, skillLevel, canvasRef, setResponseText) => {
    setLoadingQuestion(true);

    try {
      const prompt = `Think anything random that user with age group (${ageGroup}) and skill level (${skillLevel}) can draw on webpage canvas using mouse.\n\n
      It can be Alphabets, Numbers, Shapes, Objects, Animals, Birds, Fruits, Vegetables, Vehicles, etc.\n\n
      question should be Unique every time. also ask to draw only one object at a time if skill level is Beginner like Draw a Mango, etc..\n\n
      Generate only one queestion at a time.
      Response format: JSON. {
        question: "Question text"
        }
      `;
      console.log(prompt);


        // To generate text output, call generateContent with the text input
        const result = await model.generateContent(prompt);
        const fullTextResponse = await result.response.text();
        const cleanedText = fullTextResponse.replace(/```json|```/g, '').trim();
        // const response = result.response;
        console.log(cleanedText);

        let responseData;
        try {
            responseData = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            throw new Error('Invalid JSON response');
        }

        // const questionText = await response.text();
        setQuestion(responseData.question);
        setPrompt(responseData.question);
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
