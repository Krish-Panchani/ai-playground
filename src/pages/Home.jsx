import React from 'react'
import { Link } from 'react-router-dom';

import UserInfo from '../components/UserInfo';
import { motion } from 'framer-motion';


function Home() {
    const isPage = "Home";

    const revealVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: 0.2,
            },
        },
    };

    const hoverVariants = {
        hover: {
            scale: 1.05,
            rotate: 2,
            transition: {
                type: "spring",
                stiffness: 300,
            },
        },
    };

    const links = [
        {
            to: "/CreativeQuest",
            bgImage: "https://res.cloudinary.com/divve6wtz/image/upload/v1722853988/CreativeQuest-removebg-preview_qrlbc3.png",
            title: "Creative Quest",
            description: "Where Every Question Sparks a Masterpiece"
        },
        {
            to: "/ArtfulGuesswork",
            bgImage: "https://res.cloudinary.com/divve6wtz/image/upload/v1722854709/ArtfulGuesswork-removebg-preview_tc7a2u.png",
            title: "Artful Guesswork",
            description: "See if AI can identify your creation"
        },
        {
            to: "/ArtfulStories",
            bgImage: "https://res.cloudinary.com/divve6wtz/image/upload/v1722854711/ArtfulStories-removebg-preview_leuzgt.png",
            title: "Artful Stories",
            description: "Where every stroke conjures a magical tale"
        },
    ];

    const LinkCard = ({ to, bgImage, title, description }) => (
        <Link to={to} className='h-[15rem] w-full max-w-[20rem]'>
            <motion.div
                whileHover={{ scale: 1.1, rotate: 3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative group h-full flex items-end justify-center overflow-hidden rounded-xl text-center text-gray-700 border-2 border-orange-500"
                style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/100 via-black/50 to-bg-black group-hover:blur-sm transition duration-500 ease-in-out"></div>
                <div className="relative p-6 px-6 pt-14 md:px-12">
                    <h2 className="mb-6 text-2xl font-bold drop-shadow-xl bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent animate-gradient-animate group-hover:text-white transition ease-linear duration-300">
                        {title}
                    </h2>
                    <p className='hidden group-hover:block text-cyan-500 font-semibold'>
                        {description}
                    </p>
                </div>
            </motion.div>
        </Link>
    );

    return (
        <div className="flex flex-col gap-4 bg-black p-4">
            <UserInfo isPage={isPage} />
            <div>
                <h2 className="text-center text-xl sm:text-2xl my-4 text-white">
                    Welcome to{" "}
                    <span className="font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                        AI Playground
                    </span>{" "}
                    - Where Creativity meets Learning.
                </h2>
            </div>
            <div className='overflow-hidden'>
            <motion.h3
                className="text-center text-5xl sm:text-2xl my-4 text-white"
                variants={revealVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
            >
                <motion.span
                    className="font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text animate-gradient-animate text-transparent text-3xl sm:text-5xl"
                    variants={hoverVariants}
                    whileHover={{ scale: 1.1, rotate: 3 }}
                >
                    GAME MODES
                </motion.span>
            </motion.h3>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-16 py-12">
                {links.map((link, index) => (
                    <LinkCard key={index} {...link} />
                ))}
            </div>
        </div>
    )
}

export default Home;