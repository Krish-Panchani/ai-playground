import React, { useState, useRef, useCallback } from "react";

import DrawingCanvas from "../components/DrawingCanvas";
import AIResponse from "../components/AIResponse";
import UserInfo from "../components/UserInfo";
import Feedback from "../components/Feedback";
import HowPlay from "../components/ui/howPlay";

import { handleDrawingComplete, handleUpload, handleSendPrompt } from "../helpers/handleGuessDrawing";
import useAuth from "../hooks/useAuth";
import useUserScore from "../hooks/useUserScore";
import useAge from "../hooks/useAge";
import useSkill from "../hooks/useSkill";

function ArtfulGuesswork() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [responseText, setResponseText] = useState("");
  const [question, setQuestion] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
  const [isFeedback, setIsFeedback] = useState("");
  const [uniqueFileName, setUniqueFileName] = useState("");
  const isPage = "ArtfulGuesswork";

  const [setScore] = useUserScore();
  const { ageGroup, setAgeGroup, ageGroups } = useAge();
  const { skillLevel, setSkillLevel, skillLevels } = useSkill();

  const canvasRef = useRef(null);

  const user = useAuth();

  const handleAIResponse = useCallback((responseText) => {
    setResponseText(responseText);
  }, []);

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
        setQuestion={setQuestion}
        setResponseText={setResponseText}
      />
      {!question && (
        <div>
          <h2 className="text-center text-xl sm:text-2xl my-4 text-white">
            Welcome to{" "}
            <span className="font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Artful Guesswork
            </span>{" "}
            - See if AI can identify your creation
          </h2>
        </div>
      )}
      <div className="flex flex-col items-center mb-6 space-y-4">
        {loadingResponse && (
          <div className="flex items-center justify-center bg-black text-white">
            <div className="mt-4 rounded-lg p-4">
              <h3 className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-xl font-bold text-transparent animate-gradient-animate">Gemini - <span className="text-md animate-pulse font-normal text-white">Analyzing your Drawing ...</span></h3>
              <div className="mt-4 flex flex-col gap-2 rounded-lg border border-green-300 p-4 text-white">
                <div className="col-span-2 h-2 animate-pulse rounded bg-slate-200"></div>
                <div className="col-span-2 h-2 w-36 animate-pulse rounded bg-slate-200"></div>
              </div>
            </div>
          </div>
        )}

        {responseText && (
          <div className="flex items-center gap-2">
            <AIResponse
              responseText={responseText}
              isPage={isPage}
              onResponseGenerated={handleAIResponse}
              className="w-full max-w-xl bg-white shadow-md rounded-lg p-4"
            />
            <Feedback
              setResponseText={setResponseText}
              canvasRef={canvasRef}
              setIsFeedback={setIsFeedback}
              uniqueFileName={uniqueFileName}
            />
          </div>
        )}

        <p className="text-white">{isFeedback}</p>

        <div className="flex  flex-col lg:flex-row justify-between gap-4">
          <div className="bg-background rounded-lg border border-orange-500 p-4 flex flex-col gap-4">
            <DrawingCanvas
              ref={canvasRef}
              onDrawingComplete={(dataUrl) => handleDrawingComplete(dataUrl, setFile)}
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
                  setUniqueFileName,
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
              className={`flex-1 px-6 py-3 text-white rounded-full font-semibold transition-colors duration-300 ${isCanvasEmpty || responseText ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-cyan-600"}`}
              disabled={isCanvasEmpty || responseText}
            >
              {loadingUpload ? "Uploading..." : "Submit"}
            </button>
          </div>
          <div className="flex justify-center">
            <HowPlay isPage={isPage} className="text-center text-sm text-gray-700 " />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtfulGuesswork;
