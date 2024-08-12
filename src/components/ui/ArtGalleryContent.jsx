import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DragDrawer } from './DragDrawer';

const ImageWithSkeleton = ({ src, alt }) => {
    const [loading, setLoading] = useState(true);

    return (
        <div className="relative w-full">
            {loading && (
                <div className="flex items-center justify-center bg-gray-700 rounded-2xl animate-pulse">
                    <div className="w-full h-48 bg-gray-600 rounded-2xl"></div>
                </div>
            )}
            <img
                src={src}
                alt={alt}
                className={`w-full rounded-2xl px-2 h-auto transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setLoading(false)}
            />
        </div>
    );
};

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
                            {item.isCorrect === true ? (
                                <p className="px-2 text-green-500 font-semibold">Correct</p>
                            ) : (
                                <p className="px-2 text-red-500 font-semibold">Incorrect!</p>
                            )}
                            <p className="px-2 text-md font-semibold text-cyan-500">
                                Question: <span className="text-white">{item.question}</span>
                            </p>
                            <ImageWithSkeleton
                                src={`https://firebasestorage.googleapis.com/v0/b/ai-playground-89b62.appspot.com/o/${item.file}?alt=media`}
                                alt={item.question}
                            />
                            <p className="line-clamp-1 px-2">{item.reason}</p>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "ArtfulGuesswork" && (
                <div className="text-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                    {artfulGuessworkData.map((item) => (
                        <div key={item.file} className="flex flex-col gap-2 text-xl border-2 border-orange-500 rounded-2xl p-4">
                            <p className="line-clamp-1 px-2 text-center">
                                <span className="font-semibold text-cyan-500">Gemini Guess: </span>"{item.guess}"
                            </p>
                            <ImageWithSkeleton
                                src={`https://firebasestorage.googleapis.com/v0/b/ai-playground-89b62.appspot.com/o/${item.file}?alt=media`}
                                alt={item.guess}
                            />
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
                            <ImageWithSkeleton
                                src={`https://firebasestorage.googleapis.com/v0/b/ai-playground-89b62.appspot.com/o/${item.file}?alt=media`}
                                alt={item.title}
                            />
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
                        <ImageWithSkeleton
                            src={`https://firebasestorage.googleapis.com/v0/b/ai-playground-89b62.appspot.com/o/${selectedStory.file}?alt=media`}
                            alt={selectedStory.title}
                        />
                        <div className="text-justify">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedStory.story}</ReactMarkdown>
                        </div>
                    </div>
                </DragDrawer>
            )}
        </div>
    );
});

export default ArtGalleryContent;
