import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { MdLogout } from "react-icons/md";

const SignOut = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            console.log("User signed out successfully");
            navigate('/');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (

        <button
            onClick={handleSignOut}
            className='flex items-center gap-2 px-4 py-2 bg-red-500 rounded-full text-white font-semibold'>
            <MdLogout className='text-xl' />
            <span>Sign Out</span>
        </button>
    );
};

export default SignOut;