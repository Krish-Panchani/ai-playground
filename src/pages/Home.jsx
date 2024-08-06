import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import UserInfo from '../components/UserInfo';
import { auth } from "../firebase";
import useAuth from "../hooks/useAuth";
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import useUserScore from '../hooks/useUserScore';

function Home() {
    const [ageGroup, setAgeGroup] = useState("Junior Artist (Age: 12 and below)");
    const [skillLevel, setSkillLevel] = useState("Beginner");
    const score = useUserScore();
    const user = useAuth();
    const isPage = "Home";

    const signOut = () => {
        auth.signOut().then(() => {
            console.log("User signed out successfully");
        }).catch((error) => {
            console.error("Error signing out: ", error);
        });
    };

    const ageGroups = [
        "Junior Artist (Age: 12 and below)",
        "Teen Artist (Age: between 13-19)",
        "Adult Artist (Age: 20 and above)",
    ];
    const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

    return (
        <div className="flex flex-col justify-between min-h-screen bg-black p-4">
            <Header score={score} className="mb-4" />
            <UserInfo
                user={user}
                ageGroup={ageGroup}
                setAgeGroup={setAgeGroup}
                skillLevel={skillLevel}
                setSkillLevel={setSkillLevel}
                signOut={signOut}
                ageGroups={ageGroups}
                skillLevels={skillLevels}
                isPage={isPage}
            />
             <div>
                    <h2 className="text-center text-xl sm:text-2xl my-4 text-white">
                        Welcome to{" "}
                        <span className="font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                            AI Playground
                        </span>{" "}
                        - Where Creativity meets Learning.
                    </h2>
                </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-16 py-12">
                {/* <Link > */}

                <Link to={"/CreativeQuest"} className='h-[15rem] w-full max-w-[20rem]'>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="relative group grid h-[15rem] w-full max-w-[20rem] flex-col items-end justify-center overflow-hidden rounded-xl bg-clip-border text-center text-gray-700 border-2 border-orange-500">
                        <div
                            className="absolute inset-0 m-0 h-full w-full overflow-hidden rounded-none bg-transparent bg-[url('https://res.cloudinary.com/divve6wtz/image/upload/v1722853988/CreativeQuest-removebg-preview_qrlbc3.png')] bg-cover bg-clip-border bg-center text-gray-700 shadow-none">
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/100 via-black/50 to-bg-black "></div>
                        </div>
                        <div className="relative p-6 px-6 pt-14 md:px-12 ">
                            <h2 className="mb-6 block font-sans text-xl font-medium leading-[1.5] tracking-normal text-white antialiased">
                                <span className='text-2xl font-bold drop-shadow-xl bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent  animate-gradient-animate group-hover:text-white transition ease-linear duration-300'>Creative Quest</span>
                            </h2>
                            <p className='hidden group-hover:block bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent  animate-gradient-animate font-semibold'>Where Every Prompt Sparks a Masterpiece</p>
                        </div>
                    </motion.div>
                </Link>
                <Link to={"/ArtfulGuesswork"} className='h-[15rem] w-full max-w-[20rem]'>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="relative group grid h-[15rem] w-full max-w-[20rem] flex-col items-end justify-center overflow-hidden rounded-xl bg-clip-border text-center text-gray-700 border-2 border-orange-500">
                        <div
                            className="absolute inset-0 m-0 h-full w-full overflow-hidden rounded-none bg-transparent bg-[url('https://res.cloudinary.com/divve6wtz/image/upload/v1722854709/ArtfulGuesswork-removebg-preview_tc7a2u.png')] bg-cover bg-clip-border bg-center text-gray-700 shadow-none">
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/100 via-black/50 to-bg-black "></div>
                        </div>
                        <div className="relative p-6 px-6 pt-14 md:px-12 ">
                            <h2 className="mb-6 block font-sans text-xl font-medium leading-[1.5] tracking-normal text-white antialiased">
                                <span className='text-2xl font-bold drop-shadow-xl bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent  animate-gradient-animate group-hover:text-white transition ease-linear duration-300'>Artful Guesswork</span>
                            </h2>
                            <p className='hidden group-hover:block bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent  animate-gradient-animate font-semibold'>See if AI can identify your creation</p>
                        </div>
                    </motion.div>
                </Link>
                <Link to={"/ArtfulStories"} className='h-[15rem] w-full max-w-[20rem]'>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="relative group grid h-[15rem] w-full max-w-[20rem] flex-col items-end justify-center overflow-hidden rounded-xl bg-clip-border text-center text-gray-700 border-2 border-orange-500">
                        <div
                            className="absolute inset-0 m-0 h-full w-full overflow-hidden rounded-none bg-transparent bg-[url('https://res.cloudinary.com/divve6wtz/image/upload/v1722854711/ArtfulStories-removebg-preview_leuzgt.png')] bg-cover bg-clip-border bg-center text-gray-700 shadow-none">
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/100 via-black/50 to-bg-black "></div>
                        </div>
                        <div className="relative p-6 px-6 pt-14 md:px-12 ">
                            <h2 className="mb-6 block font-sans text-xl font-medium leading-[1.5] tracking-normal text-white antialiased">
                                <span className='text-2xl font-bold drop-shadow-xl bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent  animate-gradient-animate group-hover:text-white transition ease-linear duration-300'>Artful Stories</span>
                            </h2>
                            <p className='hidden group-hover:block bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent  animate-gradient-animate font-semibold'>Where every stroke conjures a magical tale</p>
                        </div>
                    </motion.div>
                </Link>
            </div>
            <Footer />
        </div>
    )
}

export default Home;