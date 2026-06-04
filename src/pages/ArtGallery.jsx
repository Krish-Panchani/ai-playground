import React, { useState, useEffect } from "react";

import UserInfo from "../components/UserInfo";
import SlideTabs from "../components/ui/SlideTabs";
import ArtGalleryContent from "../components/ui/ArtGalleryContent";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import { api } from "../lib/api";
import { showError } from "../lib/toast";

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
        const response = await api.getGallery();
        const data = response.data || {};

        setCreativeQuestData(data.creativeQuest || []);
        setArtfulGuessworkData(data.artfulGuesswork || []);
        setArtfulStoriesData(data.artfulStories || []);
      } catch (err) {
        showError(err, "Could not load the art gallery. Please try again.");
        setError(err.friendlyMessage || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (loading) return <SkeletonLoader />;
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
