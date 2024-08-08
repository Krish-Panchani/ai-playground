import React from 'react'
import { Link } from 'react-router-dom';

import UserInfo from '../components/UserInfo';
import { motion } from 'framer-motion';

import useAuth from "../hooks/useAuth";
import useAge from '../hooks/useAge';
import useSkill from '../hooks/useSkill';

function Home() {
    const { ageGroup, setAgeGroup, ageGroups } = useAge();
    const { skillLevel, setSkillLevel, skillLevels } = useSkill();
    const user = useAuth();
    const isPage = "Home";

    return (
        <div className="flex flex-col gap-14 bg-black p-4">
            <UserInfo
                user={user}
                ageGroup={ageGroup}
                setAgeGroup={setAgeGroup}
                skillLevel={skillLevel}
                setSkillLevel={setSkillLevel}
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
            <div>
                <h3 className="text-center text-5xl sm:text-2xl my-4 text-white">
                    <span className="font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text animate-gradient-animate text-transparent text-3xl sm:text-5xl">
                        GAME MODES
                    </span>
                </h3>
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
                            <p className='hidden group-hover:block bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent  animate-gradient-animate font-semibold'>Where Every Question Sparks a Masterpiece</p>
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
        </div>
    )
}

export default Home;