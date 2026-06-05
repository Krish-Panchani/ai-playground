import React, { useState, useRef, useCallback } from "react";

import DrawingCanvas from "../components/DrawingCanvas";
import AIResponse from "../components/AIResponse";
import SignInToPlay from "../components/auth/SignInToPlay";
import UserInfo from "../components/UserInfo";
import HowPlay from "../components/ui/howPlay";
import ContinueStoryChapter from "../components/ContinueStoryChapter";
import CreateNewStory from "../components/CreateNewStory";

import {
    handleDrawingComplete,
    handleUpload,
    handleSendPrompt,
} from "../helpers/handleStoryDrawing";

import useAuth from "../hooks/useAuth";
import { useUserScore } from "../hooks/UserScoreContext";
import { STORY_MAX_CHAPTERS } from "../lib/story";
import { useGameStore } from "../store/useGameStore";
import { APP_THEME } from "../theme/theme";

function ArtfulStories() {
    const [file, setFile] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [responseText, setResponseText] = useState("");
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [loadingResponse, setLoadingResponse] = useState(false);
    const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
    const [chapterSubmitted, setChapterSubmitted] = useState(false);
    const [storyComplete, setStoryComplete] = useState(false);
    const [chapterCount, setChapterCount] = useState(0);
    const [nextMission, setNextMission] = useState("");
    const canvasRef = useRef(null);
    const user = useAuth();

    const { setScore } = useUserScore();

    const handleAIResponse = useCallback((text) => {
        setResponseText(text);
    }, []);

    const handleChapterResponse = useCallback((text) => {
        setResponseText(text);
        setChapterSubmitted(true);

        try {
            const payload = JSON.parse(text);
            setChapterCount(payload.chapterCount || 0);
            setNextMission(payload.nextMission || "");
            setStoryComplete(Boolean(payload.isCompleted));
        } catch (_error) {
            // response display still handles parse errors
        }
    }, []);

    const handleCanvasDrawingComplete = useCallback((dataUrl) => {
        handleDrawingComplete(dataUrl, setFile);
        setChapterSubmitted(false);
    }, []);

    const handleContinueChapter = useCallback(() => {
        setResponseText("");
        setChapterSubmitted(false);
        setPrompt(nextMission || "");
        if (canvasRef.current) {
            canvasRef.current.clearCanvas();
        }
        setIsCanvasEmpty(true);
        setFile(null);
    }, [nextMission]);

    const handleStartNewStory = useCallback(() => {
        useGameStore.getState().resetStory();
        setResponseText("");
        setChapterSubmitted(false);
        setStoryComplete(false);
        setChapterCount(0);
        setNextMission("");
        setPrompt("");
        setFile(null);
        setIsCanvasEmpty(true);
    }, []);

    const isPage = "ArtfulStories";
    const canSubmit =
        !isCanvasEmpty &&
        !chapterSubmitted &&
        !loadingUpload &&
        !loadingResponse &&
        !storyComplete;

    return (
        <SignInToPlay subtitle="Sign in to build illustrated stories chapter by chapter.">
        <div className={`flex flex-col gap-12 ${APP_THEME.page} p-4`}>
            <UserInfo setResponseText={setResponseText} isPage={isPage} />

            <div>
                <h2 className="text-center text-xl sm:text-2xl my-4 text-white">
                    Welcome to{" "}
                    <span className={`font-bold ${APP_THEME.heroGradient}`}>
                        ArtfulStories
                    </span>{" "}
                    - Where every stroke conjures a magical tale.
                </h2>
                {chapterCount > 0 && !storyComplete && (
                    <p className={`text-center text-sm ${APP_THEME.accentText}`}>
                        Adventure in progress — Chapter {chapterCount} of {STORY_MAX_CHAPTERS} complete
                    </p>
                )}
            </div>

            <div className="flex flex-col items-center mb-6 space-y-4">
                {loadingResponse && (
                    <div className={`flex items-center justify-center ${APP_THEME.page} ${APP_THEME.panelText}`}>
                        <div className="mt-4 rounded-lg p-4">
                            <h3 className={`${APP_THEME.loadingGradient} text-xl font-bold`}>Gemini - <span className="text-md animate-pulse font-normal text-white">Writing your story chapter...</span></h3>
                            <div className="mt-4 flex flex-col gap-2 rounded-lg border border-green-300 p-4 text-white">
                                <div className="col-span-2 h-2 animate-pulse rounded bg-slate-200"></div>
                                <div className="col-span-2 h-2 w-36 animate-pulse rounded bg-slate-200"></div>
                            </div>
                        </div>
                    </div>
                )}

                {responseText && (
                    <div className="flex w-full max-w-xl flex-col items-center gap-3">
                        <AIResponse
                            loadingResponse={loadingResponse}
                            isCanvasEmpty={isCanvasEmpty}
                            responseText={responseText}
                            onResponseGenerated={handleAIResponse}
                            isPage={isPage}
                            className="w-full rounded-lg border border-orange-500/50 bg-slate-950 p-4 shadow-lg"
                        />
                        {storyComplete ? (
                            <CreateNewStory
                                onStartNew={handleStartNewStory}
                                canvasRef={canvasRef}
                            />
                        ) : (
                            <ContinueStoryChapter
                                nextMission={nextMission}
                                chapterCount={chapterCount}
                                maxChapters={STORY_MAX_CHAPTERS}
                                onContinue={handleContinueChapter}
                            />
                        )}
                    </div>
                )}

                <div className="flex flex-col lg:flex-row justify-between gap-4 w-full">

                    <div className={`${APP_THEME.card} flex flex-col gap-4 flex-1`}>
                        <DrawingCanvas
                            ref={canvasRef}
                            onDrawingComplete={handleCanvasDrawingComplete}
                            setIsCanvasEmpty={setIsCanvasEmpty}
                        />

                        <input
                            type="text"
                            name="AdditionalPrompt"
                            value={prompt}
                            placeholder="Any additional prompt or instruction?"
                            className="bg-black rounded-full px-6 py-3 text-white border-2 font-semibold transition-colors duration-300"
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={storyComplete}
                        />
                        <button
                            onClick={() =>
                                handleUpload(
                                    file,
                                    setLoadingUpload,
                                    handleSendPrompt,
                                    prompt,
                                    handleChapterResponse,
                                    setLoadingResponse,
                                    setScore,
                                    user
                                )
                            }
                            className={`flex-1 px-6 py-3 ${
                                canSubmit ? APP_THEME.primaryButton : APP_THEME.disabledButton
                            }`}
                            disabled={!canSubmit}
                        >
                            {loadingUpload ? "Uploading..." : storyComplete ? "Story complete" : "Submit chapter"}
                        </button>
                    </div>
                    <div className="flex justify-center lg:max-w-sm">
                        <HowPlay isPage={isPage} className="text-center text-sm text-slate-300" />
                    </div>
                </div>
            </div>
        </div>
        </SignInToPlay>
    );
}

export default ArtfulStories;
