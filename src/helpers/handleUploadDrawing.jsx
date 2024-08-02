import { ref, uploadBytesResumable } from 'firebase/storage';
import { firebaseApp, storage } from '../firebase';
import { getVertexAI, getGenerativeModel } from "firebase/vertexai-preview";

export const handleDrawingComplete = (dataUrl, setFile) => {
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const buffer = new ArrayBuffer(byteString.length);
    const data = new Uint8Array(buffer);
    for (let i = 0; i < byteString.length; i++) {
        data[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([buffer], { type: mimeString });
    setFile(new File([blob], 'drawing.png', { type: mimeString }));
};

export const handleUpload = async (file, setLoadingUpload, handleSendPrompt, prompt, setResponseText, setLoadingResponse, setScore) => {
    if (!file) {
        alert('Please complete a drawing to upload');
        return;
    }

    setLoadingUpload(true);

    try {
        const uniqueFileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, uniqueFileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                // Progress function
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
            },
            (error) => {
                // Handle unsuccessful uploads
                console.error('Error uploading file:', error);
                alert('Error uploading file: ' + error.message);
                setLoadingUpload(false);
            },
            async () => {
                alert('Drawing uploaded to AI - Successfully');
                await handleSendPrompt(uniqueFileName, prompt, setResponseText, setLoadingResponse, setScore);
                setLoadingUpload(false);
            }
        );
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file: ' + error.message);
        setLoadingUpload(false);
    }
};

export const handleSendPrompt = async (uniqueFileName, prompt, setResponseText, setLoadingResponse, setScore) => {
    setLoadingResponse(true);

    try {
        const vertexAI = getVertexAI(firebaseApp);
        const bucket_name = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET; 
        const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });
        const combinedPrompt = `"Statement: ${prompt}".\n\n
    Compare the statement with Image and check if statement object is present in the image or not if present then return isCorrect:true else return isCorrect:false in JSON format. also give reason why it is correct or not. and give point between 1 to 10 according to how drawing match with statement, give 1 point if isCorrect is false.\n\n
    json format: {isCorrect: boolean, reason: string, points: number}`;

        const imageUri = `gs://${bucket_name}/${uniqueFileName}`;
        const mimeType = 'image/png';

        // For images, the SDK supports both Google Cloud Storage URI and base64 strings
        const imagePart = {
            fileData: {
                fileUri: imageUri,
                mimeType: mimeType,
            },
        };
        // Generate a response
        const result = await model.generateContent([combinedPrompt, imagePart]);

        // Extract the text from the response
        const fullTextResponse = await result.response.text();

        // Log the raw response text for debugging
        console.log(fullTextResponse);

        // Remove code block markers and trim any extra whitespace
        const cleanedText = fullTextResponse.replace(/```json|```/g, '').trim();

        // Log the cleaned text for debugging
        console.log(cleanedText);

        // Try parsing the JSON response
        let responseData;
        try {
            responseData = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            throw new Error('Invalid JSON response');
        }

        // Log the parsed data for debugging
        console.log(responseData);

        // Use the data
        setResponseText(cleanedText);
        setLoadingResponse(false);
        setScore(prevScore => prevScore + (responseData.points || 0));
    } catch (error) {
        console.error('Error getting response from cloud function:', error);
        alert('Error getting response from cloud function: ' + error.message);
        setLoadingResponse(false);
    }
};