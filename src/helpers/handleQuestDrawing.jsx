import { ref, uploadBytesResumable } from 'firebase/storage';
import { firebaseApp, storage, firestore } from '../firebase';
import { getVertexAI, getGenerativeModel } from "firebase/vertexai-preview";
import { doc, setDoc, getDoc, addDoc, collection, Timestamp } from 'firebase/firestore';

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

export const handleUpload = async (file, setLoadingUpload, handleSendPrompt, prompt, setResponseText, setLoadingResponse, setScore, user) => {
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
                await handleSendPrompt(uniqueFileName, prompt, setResponseText, setLoadingResponse, setScore, user);
                setLoadingUpload(false);
            }
        );
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file: ' + error.message);
        setLoadingUpload(false);
    }
};

export const handleSendPrompt = async (uniqueFileName, prompt, setResponseText, setLoadingResponse, setScore, user) => {
    setLoadingResponse(true);

    try {
        // Your existing code for generating response
        const vertexAI = getVertexAI(firebaseApp);
        const bucket_name = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET;
        const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-pro-001" });
        const combinedPrompt = `"Statement: ${prompt}".\n\n
        Compare the statement with Image and check if statement object is present in the image or not if present then return isCorrect:true else return isCorrect:false in JSON format. also give reason why it is correct or not and give point between 1 to 10 according to how drawing match with statement, give 1 point if isCorrect is false.\n\n
        json format: {isCorrect: boolean, reason: string, points: number}`;

        const imageUri = `gs://${bucket_name}/${uniqueFileName}`;
        const mimeType = 'image/png';

        const imagePart = {
            fileData: {
                fileUri: imageUri,
                mimeType: mimeType,
            },
        };

        const result = await model.generateContent([combinedPrompt, imagePart]);
        const fullTextResponse = await result.response.text();
        const cleanedText = fullTextResponse.replace(/```json|```/g, '').trim();

        let responseData;
        try {
            responseData = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            throw new Error('Invalid JSON response');
        }

        setResponseText(cleanedText);
        setLoadingResponse(false);

        if (user) {
            // Fetch current user score
            const userDocRef = doc(firestore, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            let currentScore = 0;
            if (userDoc.exists()) {
                currentScore = userDoc.data().score || 0;
            }

            // Calculate new score
            const newScore = currentScore + (responseData.points || 0);
            console.log('New score:', newScore);
            // Update Firestore with new score
            await setDoc(userDocRef, { score: newScore }, { merge: true });

            // Update local state
            setScore(newScore);
        } else {
            // For guests, just update local state
            setScore(prevScore => prevScore + (responseData.points || 0));
        }

        const responseObj = {
            email: user ? user.email : "guest",
            question: prompt,
            isCorrect: responseData.isCorrect,
            reason: responseData.reason,
            file: uniqueFileName,
            timestamp: Timestamp.now(),
        };
        try {
            const responseCollectionRef = collection(firestore, "CreativeQuest");
            await addDoc(responseCollectionRef, responseObj);
            console.log("Response stored successfully");
        } catch (error) {
            console.error("Error storing response:", error);
            alert("Error storing response: " + error.message);
        }

    } catch (error) {
        console.error('Error getting response from cloud function:', error);
        alert('Error getting response from cloud function: ' + error.message);
        setLoadingResponse(false);
    }
};