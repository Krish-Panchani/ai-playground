// src/components/Login.jsx

import React from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase'; // Make sure to import firestore
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';

import useQuestion from '../hooks/useQuestion';

const Login = ({ setResponseText, isPage }) => {

  const { setQuestion } = useQuestion();
  const navigate = useNavigate();
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

        if (isPage === 'CreativeQuest') {
          setQuestion(''); // Clear the question after sign in
          setResponseText(''); // Clear the responseText after sign in
        }
        console.log("User document created in Firestore:");
      } else {
        if (isPage) {
          setQuestion(''); // Clear the question after sign in
          setResponseText(''); // Clear the responseText after sign in
        }
        console.log("User document already exists in Firestore");
      }
      navigate('/'); // Redirect to home page after sign in
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  return (
    <div>
      <button onClick={signInWithGoogle} className='flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-cyan-500  font-semibold px-4 py-2 rounded-full text-white'>
        <FcGoogle className='text-2xl bg-white rounded-full px-1 py-1' />
        <span className='text-xs sm:text-base font-semibold'>
          Sign in with Google</span>
      </button>
    </div>
  );
};

export default Login;
