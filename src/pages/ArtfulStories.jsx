import React, { useState, useRef, useCallback } from "react";

import DrawingCanvas from "../components/DrawingCanvas";
import AIResponse from "../components/AIResponse";
import SignInToPlay from "../components/auth/SignInToPlay";
import UserInfo from "../components/UserInfo";
import HowPlay from "../components/ui/howPlay";

import {
    handleDrawingComplete,
    handleUpload,
    handleSendPrompt,
} from "../helpers/handleStoryDrawing";

import useAuth from "../hooks/useAuth";
import { useUserScore } from "../hooks/UserScoreContext";
import CreateNewStory from "../components/CreateNewStory";
import { APP_THEME } from "../theme/theme";

function ArtfulStories() {
    const [file, setFile] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [responseText, setResponseText] = useState("");
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [loadingResponse, setLoadingResponse] = useState(false);
    const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
    const canvasRef = useRef(null);
    const user = useAuth();

    const { setScore } = useUserScore();

    const handleAIResponse = useCallback((responseText) => {
        setResponseText(responseText);
    }, []);

    const isPage = "ArtfulStories";

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
            </div>

            <div className="flex flex-col items-center mb-6 space-y-4">
                {loadingResponse && (
                    <div className={`flex items-center justify-center ${APP_THEME.page} ${APP_THEME.panelText}`}>
                        <div className="mt-4 rounded-lg p-4">
                            <h3 className={`${APP_THEME.loadingGradient} text-xl font-bold`}>Gemini - <span className="text-md animate-pulse font-normal text-white">Analyzing your Drawing ...</span></h3>
                            <div className="mt-4 flex flex-col gap-2 rounded-lg border border-green-300 p-4 text-white">
                                <div className="col-span-2 h-2 animate-pulse rounded bg-slate-200"></div>
                                <div className="col-span-2 h-2 w-36 animate-pulse rounded bg-slate-200"></div>
                            </div>
                        </div>
                    </div>
                )}

                {responseText && !isCanvasEmpty && (
                    <div className="flex flex-col items-center gap-2">
                        <AIResponse
                            loadingResponse={loadingResponse}
                            isCanvasEmpty={isCanvasEmpty}
                            responseText={responseText}
                            onResponseGenerated={handleAIResponse}
                            isPage={isPage}
                            className="w-full max-w-xl rounded-lg border border-orange-500/50 bg-slate-950 p-4 shadow-lg"
                        />
                        <CreateNewStory
                            setResponseText={setResponseText}
                            canvasRef={canvasRef}
                        />
                    </div>
                )}

                <div className="flex  flex-col lg:flex-row justify-between gap-4">

                    <div className={`${APP_THEME.card} flex flex-col gap-4`}>
                        <DrawingCanvas
                            ref={canvasRef}
                            onDrawingComplete={(dataUrl) =>
                                handleDrawingComplete(dataUrl, setFile)
                            }
                            setIsCanvasEmpty={setIsCanvasEmpty}
                        />

                        <input
                            type="text"
                            name="AdditionalPrompt"
                            placeholder="Any Additional Prompt or Instruction?"
                            className="bg-black rounded-full px-6 py-3 text-white border-2 font-semibold transition-colors duration-300"
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <button
                            onClick={() =>
                                handleUpload(
                                    file,
                                    setLoadingUpload,
                                    handleSendPrompt,
                                    prompt,
                                    setResponseText,
                                    setLoadingResponse,
                                    setScore,
                                    user
                                )
                            }
                            className={`flex-1 px-6 py-3 ${isCanvasEmpty || responseText
                                ? APP_THEME.disabledButton
                                : APP_THEME.primaryButton
                                }`}
                            disabled={isCanvasEmpty || responseText}
                        >
                            {loadingUpload ? "Uploading..." : "Submit"}
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <HowPlay isPage={isPage} className="text-center text-sm text-slate-300" />
                    </div>
                </div>
            </div>
        </div>
        </SignInToPlay>
    );
}

export default ArtfulStories;
