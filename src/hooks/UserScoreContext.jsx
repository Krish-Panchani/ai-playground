import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import useAuth from './useAuth';

const UserScoreContext = createContext();

export const UserScoreProvider = ({ children }) => {
    const [score, setScore] = useState(0);
    const user = useAuth();

    useEffect(() => {
        const fetchUserScore = async () => {
            if (user) {
                const userDocRef = doc(firestore, "users", user.uid);
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setScore(data.score || 0);
                } else {
                    await setDoc(userDocRef, {
                        displayName: user.displayName,
                        email: user.email,
                        score: 0,
                    });
                    setScore(0);
                }
            } else {
                setScore(0);
            }
        };

        fetchUserScore();
    }, [user]);

    return (
        <UserScoreContext.Provider value={{ score, setScore }}>
            {children}
        </UserScoreContext.Provider>
    );
};

export const useUserScore = () => {
    return useContext(UserScoreContext);
};
