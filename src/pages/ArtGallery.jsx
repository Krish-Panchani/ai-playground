

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import UserInfo from '../components/UserInfo';
import useAuth from "../hooks/useAuth";
import Footer from '../components/Footer';
import useAge from '../hooks/useAge';
import useSkill from '../hooks/useSkill';
import { getDocs, collection } from 'firebase/firestore';
import { firestore } from '../firebase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ArtGallery() {
    const { ageGroup, setAgeGroup, ageGroups } = useAge();
    const { skillLevel, setSkillLevel, skillLevels } = useSkill();
    const user = useAuth();
    const isPage = "ArtGallery";
    const [activeTab, setActiveTab] = useState("CreativeQuest");
    const [creativeQuestData, setCreativeQuestData] = useState([]);
    const [artfulGuessworkData, setArtfulGuessworkData] = useState([]);

    useEffect(() => {
        const fetchCreativeQuestData = async () => {
            const creativeQuestRef = collection(firestore, "CreativeQuest");
            const creativeQuestSnapshot = await getDocs(creativeQuestRef);
            const creativeQuestData = creativeQuestSnapshot.docs
                .map((doc) => doc.data())
                .filter((data) => data.isCorrect === true);
            setCreativeQuestData(creativeQuestData);
        };

        fetchCreativeQuestData();

        const fetchArtfulGuessworkData = async () => {
            const artfulGuessworkRef = collection(firestore, "ArtfulGuesswork");
            const artfulGuessworkSnapshot = await getDocs(artfulGuessworkRef);
            const artfulGuessworkData = artfulGuessworkSnapshot.docs.map((doc) => doc.data());
            setArtfulGuessworkData(artfulGuessworkData);
        };

        fetchArtfulGuessworkData();    

        
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="flex flex-col min-h-screen bg-black p-4">
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
            <SlideTabs activeTab={activeTab} onTabClick={handleTabClick} />
            {activeTab === "CreativeQuest" && <CreativeQuestUI data={creativeQuestData} />}
            {activeTab === "ArtfulGuesswork" && <ArtfulGuessworkUI data={artfulGuessworkData} />}
            {activeTab === "ArtfulStories" && <ArtfulStoriesUI />}
            <Footer />
        </div>
    )
}

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
            className="relative mx-auto flex w-fit rounded-full border-2 border-black bg-white p-1"
        >
            <Tab setPosition={setPosition} activeTab={activeTab} onTabClick={onTabClick}>CreativeQuest</Tab>
            <Tab setPosition={setPosition} activeTab={activeTab} onTabClick={onTabClick}>Artful Guesswork</Tab>
            <Tab setPosition={setPosition} activeTab={activeTab} onTabClick={onTabClick}>Artful Stories</Tab>

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

const CreativeQuestUI = ({ data }) => {
    return (
        <div className="text-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {data.map((item) => (
            <div key={item.file} className="flex flex-col gap-2 border-2 border-orange-500 rounded-2xl p-4">
                <p className="px-2 text-md font-semibold text-cyan-500">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.question}
                    </ReactMarkdown>
                </p>
                <p className="line-clamp-1 px-2">{item.reason}</p>
                <img className="w-full rounded-2xl  px-2  h-auto" src={`https://firebasestorage.googleapis.com/v0/b/ai-playground-89b62.appspot.com/o/${item.file}?alt=media`} alt={`${item.question}`} />
            </div>
            ))}
        </div>
        );
};

const ArtfulGuessworkUI = ({ data }) => {
    return (
        <div className="text-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {data.map((item) => (
            <div key={item.file} className="flex flex-col gap-2 border-2 border-orange-500 rounded-2xl p-4">
                {/* <p className="px-2 text-md font-semibold text-cyan-500">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.question}
                    </ReactMarkdown>
                </p> */}
                <p className="line-clamp-1 px-2">{item.guess}</p>
                {/* <img className="w-full rounded-2xl  px-2  h-auto" src={`https://firebasestorage.googleapis.com/v0/b/ai-playground-89b62.appspot.com/o/${item.file}?alt=media`} alt={`${item.guess}`} /> */}
            </div>
            ))}
        </div>
        );
};

const ArtfulStoriesUI = () => {
    return <div>Artful Stories UI</div>;
};

export default ArtGallery;

