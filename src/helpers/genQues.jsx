import { firebaseApp } from "../firebase";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai-preview";
const vertexAI = getVertexAI(firebaseApp);

// Configure the model with increased temperature for randomness
const model = getGenerativeModel(vertexAI, { 
    model: "gemini-1.5-pro-001",
    generationConfig: {
        temperature: 1.2,
    },
});

// Arrays of various categories
const objects = ['Car', 'Bicycle', 'Chair', 'Tree', 'House', 'Sun', 'Flower', 'Cup', 'Book', 'Ball', 'Cat', 'Dog', 'Fish', 'Star', 'Cloud', 'Smile', 'Heart', 'Moon', 'Bird', 'Cake'];
const fruits = ['Apple', 'Banana', 'Mango', 'Strawberry', 'Orange', 'Grapes', 'Watermelon', 'Pineapple', 'Cherry', 'Pear'];
const animals = ['Cat', 'Dog', 'Elephant', 'Lion', 'Bird', 'Fish', 'Butterfly', 'Turtle', 'Giraffe', 'Monkey'];
const vegetables = ['Carrot', 'Tomato', 'Potato', 'Broccoli', 'Cucumber', 'Pepper', 'Onion', 'Radish'];
const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

// Function to get a random element from an array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Function to generate a random seed
const generateRandomSeed = () => Math.floor(Math.random() * 10000);

export const handleGenerateQuestion = async (setLoadingQuestion, setQuestion, setPrompt, ageGroup, skillLevel, canvasRef, setResponseText) => {
    setLoadingQuestion(true);

    try {
        // Generate random selections from arrays
        const randomObject = getRandomElement(objects);
        const randomFruit = getRandomElement(fruits);
        const randomAnimal = getRandomElement(animals);
        const randomVegetable = getRandomElement(vegetables);
        const randomAlphabet = getRandomElement(alphabets);
        const randomNumber = getRandomElement(numbers);

        // Generate a random seed
        const randomSeed = generateRandomSeed();

        // Expanded list of prompt templates with placeholders for random elements
        const randomPromptTemplates = [
            `Can you suggest a unique single object for someone in the age group ${ageGroup} and skill level ${skillLevel} to draw on a webpage canvas? The question should include only one thing to draw. Use this seed: ${randomSeed}. For example, just a ${randomFruit}. Respond with JSON: {"question": "Generated question"}.`,
            `Imagine a child with age group ${ageGroup} and skill level ${skillLevel}. What is one single thing they could draw on the canvas? The question should include only one thing to draw. (Seed: ${randomSeed}). Perhaps just a ${randomAnimal}. Respond with JSON: {"question": "Generated question"}.`,
            `Generate a drawing prompt for age group ${ageGroup} with skill level ${skillLevel}. Make sure the question includes only one thing to draw. Seed: ${randomSeed}. Maybe just a ${randomAlphabet}. Respond with JSON: {"question": "Generated question"}.`,
            `For a user aged ${ageGroup} with skill level ${skillLevel}, suggest a drawing task involving just one item. The question should include only one thing to draw. Example: a ${randomObject}. Seed: ${randomSeed}. Respond with JSON: {"question": "Generated question"}.`,
            `A child in age group ${ageGroup} and skill level ${skillLevel} is looking for something to draw on the canvas. The question should include only one thing to draw. Using seed ${randomSeed}, suggest drawing a single ${randomVegetable}. Respond with JSON: {"question": "Generated question"}.`,
            `What should a child aged ${ageGroup} with skill level ${skillLevel} draw next? Use seed ${randomSeed} and suggest one specific thing like drawing a ${randomAnimal}. The question should include only one thing to draw. Respond with JSON: {"question": "Generated question"}.`,
            `Please generate a unique drawing prompt for a user in the age group ${ageGroup} with skill level ${skillLevel}. Make sure the question includes only one thing to draw. Use seed ${randomSeed}. You can suggest something like drawing just a ${randomFruit}. Respond with JSON: {"question": "Generated question"}.`,
            `Suggest a creative drawing idea for a child aged ${ageGroup} with skill level ${skillLevel}. The question should include only one thing to draw. Use seed ${randomSeed}. Perhaps they could draw a single ${randomAlphabet} or ${randomNumber}. Respond with JSON: {"question": "Generated question"}.`
        ];

        // Choose a random prompt from the templates
        const prompt = randomPromptTemplates[Math.floor(Math.random() * randomPromptTemplates.length)];

        // console.log(prompt); // Debugging

        const result = await model.generateContent(prompt);
        const fullTextResponse = await result.response.text();
        const cleanedText = fullTextResponse.replace(/```json|```/g, '').trim();

        // console.log(cleanedText); // Debugging

        let responseData;
        try {
            responseData = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            throw new Error('Invalid JSON response');
        }

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
