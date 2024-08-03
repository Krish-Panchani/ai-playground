import { firebaseApp } from "../firebase";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai-preview";
const vertexAI = getVertexAI(firebaseApp);
const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });

export const handleGenerateQuestion = async (setLoadingQuestion, setQuestion, setPrompt, ageGroup, skillLevel, canvasRef, setResponseText) => {
    setLoadingQuestion(true);

    try {
        const prompt = `
       Generate a unique drawing prompt suitable for a webpage canvas, based on the user's age group (${ageGroup}) and skill level (${skillLevel}). The prompt should ask the user to draw something appropriate for their age and skill level.

Here are examples for different artist levels:

- **Junior Artist (Age: 12 and below):**
  - Beginner (Ages 8-10): "Draw the number 7 in a fun and colorful style."
  - Intermediate (Ages 11-12): "Draw the letter 'A' decorated with patterns or designs."

- **Teen Artist (Ages 13-19):**
  - Beginner: "Draw a cool, stylized skateboard with some graffiti art."
  - Intermediate: "Draw a fantasy creature like a dragon or unicorn."
  - Advanced: "Draw a detailed skateboard park with ramps and rails."

- **Adult Artist (Age 20 and above):**
  - Beginner: "Draw a geometric pattern using different shapes and colors."
  - Intermediate: "Draw a scene from your favorite cityscape with architectural details."
  - Advanced: "Draw a detailed portrait of a person or a character from a story."

Ensure the prompt is unique each time and suitable for the given artist level and skill level.
Generated Question should be in one Line.

        `;


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
