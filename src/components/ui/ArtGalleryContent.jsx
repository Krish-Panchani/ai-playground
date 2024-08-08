import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DragDrawer } from './DragDrawer'; // Import the drawer component

const ArtGalleryContent = React.memo(({ activeTab, creativeQuestData, artfulGuessworkData, artfulStoriesData }) => {
    const [selectedStory, setSelectedStory] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const openDrawer = (story) => {
        setSelectedStory(story);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setSelectedStory(null);
    };

    return (
        <div>
            {activeTab === "CreativeQuest" && (
                <div className="text-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                    {creativeQuestData.map((item) => (
                        <div key={item.file} className="flex flex-col gap-2 border-2 border-orange-500 rounded-2xl p-4">
                            <p className="px-2 text-md font-semibold text-cyan-500">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.question}</ReactMarkdown>
                            </p>
                            <p className="line-clamp-1 px-2">{item.reason}</p>
                            <img className="w-full rounded-2xl px-2 h-auto" src={`https://firebasestorage.googleapis.com/v0/b/ai-playground-89b62.appspot.com/o/${item.file}?alt=media`} alt={`${item.question}`} />
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "ArtfulGuesswork" && (
                <div className="text-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                    {artfulGuessworkData.map((item) => (
                        <div key={item.file} className="flex flex-col gap-2 text-xl border-2 border-orange-500 rounded-2xl p-4">
                            <p className="line-clamp-1 px-2 text-center"><span className='font-semibold text-cyan-500'>Gemini Guess: </span>"{item.guess}"</p>
                            <img className="w-full rounded-2xl px-2 h-auto" src={`https://firebasestorage.googleapis.com/v0/b/ai-playground-89b62.appspot.com/o/${item.file}?alt=media`} alt={`${item.guess}`} />
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "ArtfulStories" && (
                <div className="text-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                    {artfulStoriesData.map((item) => (
                        <div key={item.file} className="flex flex-col gap-2 border-2 border-orange-500 rounded-2xl p-4">
                            <div className="text-xl font-semibold text-cyan-500 px-2 uppercase py-2">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.title}</ReactMarkdown>
                            </div>
                            <img className="w-full rounded-2xl px-2 h-auto" src={`https://firebasestorage.googleapis.com/v0/b/ai-playground-89b62.appspot.com/o/${item.file}?alt=media`} alt={`${item.title}`} />
                            <div className="line-clamp-3 px-2">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.story}</ReactMarkdown>
                            </div>
                            <button 
                                onClick={() => openDrawer(item)}
                                className="mt-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold px-4 py-2"
                            >
                                Read Story
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {drawerOpen && selectedStory && (
                <DragDrawer open={drawerOpen} setOpen={closeDrawer}>
                <div className="mx-auto max-w-2xl space-y-4 text-neutral-400">
                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent uppercase">
                        {selectedStory.title}
                    </h2>
                    <img className="w-full rounded-2xl mb-4" src={`https://firebasestorage.googleapis.com/v0/b/ai-playground-89b62.appspot.com/o/${selectedStory.file}?alt=media`} alt={`${selectedStory.title}`} />
                    <div className='text-justify'>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedStory.story}</ReactMarkdown>
                    </div>
                    </div>
                </DragDrawer>
            )}
        </div>
    );
});

export default ArtGalleryContent;
