// src/components/Login.jsx

import React from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase'; // Make sure to import firestore

const Login = ({ setQuestion, setResponseText }) => {
  const auth = getAuth();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create or update user document in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        console.log("Creating new user document in Firestore");
        // New user, create document with initial score of 0
        await setDoc(userDocRef, {
          displayName: user.displayName,
          email: user.email,
          score: 0
        });
        setQuestion(''); // Clear the question after sign in
        setResponseText(''); // Clear the responseText after sign in
        console.log("User document created in Firestore:");
      } else {
        setQuestion(''); // Clear the question after sign in
        setResponseText(''); // Clear the responseText after
        console.log("User document already exists in Firestore");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  return (
    <div>
      <button onClick={signInWithGoogle} className='text-black  font-semibold px-4 py-2 rounded-full bg-white'>Sign in with Google</button>
    </div>
  );
};

export default Login;
