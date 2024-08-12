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

export const handleUpload = async (file, setUniqueFileName, setLoadingUpload, handleSendPrompt, prompt, setResponseText, setLoadingResponse, setScore, user) => {
    if (!file) {
        alert('Please complete a drawing to upload');
        return;
    }

    setLoadingUpload(true);

    try {
        const uniqueFileName = `${Date.now()}_${file.name}`;
        setUniqueFileName(uniqueFileName);
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
        const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash-001" });
        const combinedPrompt = `Guess what user drawn in given Drawing. ${prompt}.
        your Response should in JSON format { guess: string }. \n\n
        For example: {
        guess: "It's a cat"
        }`;

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

        const points = Math.floor(Math.random() * 6) + 1;
        // console.log('Points:', points);

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
            const newScore = currentScore + (points || 0);
            console.log('New score:', newScore);
            // Update Firestore with new score
            await setDoc(userDocRef, { score: newScore }, { merge: true });

            // Update local state
            await setScore(newScore);

            // Store response and user email in "ArtfullGuesswork" collection

        } else {
            // For guests, just update local state
            await  setScore(prevScore => prevScore + (points || 0));
        }
        const responseObj = {
            email: user ? user.email : "guest",
            guess: responseData.guess,
            file: uniqueFileName,
            isCorrect: false,
            timestamp: Timestamp.now(),
        };

        try {
            const responseCollectionRef = collection(firestore, "ArtfulGuesswork");
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