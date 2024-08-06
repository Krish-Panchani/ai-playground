import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import useAuth from '../auth/useAuth'; // Ensure the path is correct

const useUserScore = () => {
    const [score, setScore] = useState(0); // Initialize with 0
    const user = useAuth();

    useEffect(() => {
        const fetchUserScore = async () => {
            if (user) {
                console.log("Fetching user score from Firestore");
                const userDocRef = doc(firestore, "users", user.uid);
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setScore(data.score || 0); // Set score from Firestore, default to 0
                    console.log("User score:", data.score);
                } else {
                    console.log("Creating new user document in Firestore");
                    // New user, create document with initial score of 0
                    await setDoc(userDocRef, {
                        displayName: user.displayName,
                        email: user.email,
                        score: 0,
                    });
                    setScore(0); // Set initial score for new users
                }
            } else {
                console.log("User not signed in");
                setScore(0); // Set score to 0 for guest user
            }
        };

        fetchUserScore();
    }, [user]);

    return [score, setScore]; // Return both score and setter
};

export default useUserScore;
