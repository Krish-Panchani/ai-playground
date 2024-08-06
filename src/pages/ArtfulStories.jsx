import React, { useState, useRef, useCallback } from "react";
import DrawingCanvas from "../components/DrawingCanvas";
import HowPlay from "../components/howPlay";
import Header from "../components/Header";
import AIResponse from "../components/AIResponse";
import UserInfo from "../components/UserInfo";
import {
    handleDrawingComplete,
    handleUpload,
    handleSendPrompt,
} from "../helpers/handleStoryDrawing";
import { auth } from "../firebase";
import useAuth from "../auth/useAuth";
import useUserScore from "../hooks/useUserScore";

function ArtfulStories() {
    const [file, setFile] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [responseText, setResponseText] = useState("");
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [loadingResponse, setLoadingResponse] = useState(false);
    const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
    const [score, setScore] = useUserScore(); // Ensure this is an array with [score, setScore]
    const canvasRef = useRef(null);
    const user = useAuth();

    const [ageGroup, setAgeGroup] = useState("Junior Artist (Age: 12 and below)");
    const [skillLevel, setSkillLevel] = useState("Beginner");

    const signOut = () => {
        auth.signOut().then(() => {
            console.log("User signed out successfully");
        }).catch((error) => {
            console.error("Error signing out: ", error);
        });
    };

    const handleAIResponse = useCallback((responseText) => {
        setResponseText(responseText);
    }, []);

    const ageGroups = [
        "Junior Artist (Age: 12 and below)",
        "Teen Artist (Age: between 13-19)",
        "Adult Artist (Age: 20 and above)",
    ];
    const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
    const isPage = "ArtfulStories";

    return (
        <div className="flex flex-col min-h-screen bg-black p-4">
            <Header score={score} className="mb-4" />
            <UserInfo
                user={user}
                ageGroup={ageGroup}
                setAgeGroup={setAgeGroup}
                skillLevel={skillLevel}
                setSkillLevel={setSkillLevel}
                signOut={signOut}
                ageGroups={ageGroups}
                skillLevels={skillLevels}
                setResponseText={setResponseText}
            />
            <div>
                <h2 className="text-center text-xl sm:text-2xl my-4 text-white">
                    Welcome to{" "}
                    <span className="font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                        ArtfulStories
                    </span>{" "}
                    - Where every stroke conjures a magical tale.
                </h2>
            </div>

            <div className="flex flex-col items-center mb-6 space-y-4">
                {loadingResponse && <p>Loading AI response...</p>}
                {responseText && !isCanvasEmpty && (
                    <AIResponse
                        loadingResponse={loadingResponse}
                        isCanvasEmpty={isCanvasEmpty}
                        responseText={responseText}
                        onResponseGenerated={handleAIResponse}
                        isPage={isPage}
                        className="w-full max-w-xl bg-white shadow-md rounded-lg p-4"
                    />
                )}
                {responseText && (
                    <div className="flex flex-col items-center gap-4">
                        <h3 className="text-center text-lg text-white">
                            Draw and Create New Story 🎉
                        </h3>
                    </div>
                )}

                <div className="flex justify-between gap-4">
                    <div className="flex">
                        <HowPlay isPage={isPage} className="text-center text-sm text-gray-700" />
                    </div>

                    <div className="bg-background rounded-lg border border-orange-500 p-4 flex flex-col gap-4">
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
                                    user,
                                    ageGroup,
                                    skillLevel,
                                    isPage
                                )
                            }
                            className={`flex-1 px-6 py-3 text-white rounded-full font-semibold transition-colors duration-300 ${isCanvasEmpty || responseText
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-indigo-600 to-cyan-600"
                                }`}
                            disabled={isCanvasEmpty || responseText}
                        >
                            {loadingUpload ? "Uploading..." : "Submit"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArtfulStories;
