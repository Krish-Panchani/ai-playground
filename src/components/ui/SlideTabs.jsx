import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const SlideTabs = ({ activeTab, onTabClick }) => {
    const [position, setPosition] = useState({
        left: 0,
        width: 0,
        opacity: 0,
    });

    return (
        <ul
            onMouseLeave={() => {
                setPosition((pv) => ({
                    ...pv,
                    opacity: 0,
                }));
            }}
            className="relative mx-auto flex rounded-full border-2 border-black bg-white p-1 overflow-x-scroll sm:overflow-x-auto"
        >
            <Tab setPosition={setPosition} activeTab={activeTab} onTabClick={onTabClick}>CreativeQuest</Tab>
            <Tab setPosition={setPosition} activeTab={activeTab} onTabClick={onTabClick}>ArtfulGuesswork</Tab>
            <Tab setPosition={setPosition} activeTab={activeTab} onTabClick={onTabClick}>ArtfulStories</Tab>

            <Cursor position={position} />
        </ul>
    );
};

const Tab = ({ children, setPosition, activeTab, onTabClick }) => {
    const ref = useRef(null);

    return (
        <li
            ref={ref}
            onMouseEnter={() => {
                if (!ref?.current) return;

                const { width } = ref.current.getBoundingClientRect();

                setPosition({
                    left: ref.current.offsetLeft,
                    width,
                    opacity: 1,
                });
            }}
            onClick={() => onTabClick(children)}
            className={`relative z-10 block cursor-pointer px-3 py-1.5 font-bold text-xs uppercase md:px-5 md:py-3 md:text-base ${activeTab === children ? 'bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent' : 'bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent'}`}
        >
            {children}
        </li>
    );
};

const Cursor = ({ position }) => {
    return (
        <motion.li
            animate={{
                ...position,
            }}
            className="absolute z-0 h-7 rounded-full bg-black md:h-12"
        />
    );
};

export default SlideTabs;
