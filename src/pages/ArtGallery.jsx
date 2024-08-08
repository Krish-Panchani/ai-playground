import React, { useState, useEffect } from "react";
import { getDocs, collection } from 'firebase/firestore';
import { firestore } from '../firebase';
import UserInfo from '../components/UserInfo';
import SlideTabs from '../components/ui/SlideTabs';
import ArtGalleryContent from '../components/ui/ArtGalleryContent';

function ArtGallery() {

    const [activeTab, setActiveTab] = useState("CreativeQuest");
    const [creativeQuestData, setCreativeQuestData] = useState([]);
    const [artfulGuessworkData, setArtfulGuessworkData] = useState([]);
    const [artfulStoriesData, setArtfulStoriesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [creativeQuestSnapshot, artfulGuessworkSnapshot, artfulStoriesSnapshot] = await Promise.all([
                    getDocs(collection(firestore, "CreativeQuest")),
                    getDocs(collection(firestore, "ArtfulGuesswork")),
                    getDocs(collection(firestore, "ArtfulStories")),
                ]);

                const fetchedCreativeQuestData = creativeQuestSnapshot.docs
                    .map((doc) => doc.data())
                    .filter((data) => data.isCorrect === true);
                const fetchedArtfulGuessworkData = artfulGuessworkSnapshot.docs.map((doc) => doc.data());
                const fetchedArtfulStoriesData = artfulStoriesSnapshot.docs.map((doc) => doc.data());

                setCreativeQuestData(fetchedCreativeQuestData);
                setArtfulGuessworkData(fetchedArtfulGuessworkData);
                setArtfulStoriesData(fetchedArtfulStoriesData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    if (loading) return <div className="text-white">Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="flex flex-col min-h-screen bg-black p-4">
            <UserInfo isPage="ArtGallery" />

            <div className="flex">
                <SlideTabs activeTab={activeTab} onTabClick={handleTabClick} />
            </div>
            <ArtGalleryContent
                activeTab={activeTab}
                creativeQuestData={creativeQuestData}
                artfulGuessworkData={artfulGuessworkData}
                artfulStoriesData={artfulStoriesData}
            />
        </div>
    );
}

export default ArtGallery;
