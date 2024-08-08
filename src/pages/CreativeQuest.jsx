import React, { useState, useRef, useCallback } from "react";
import DrawingCanvas from "../components/DrawingCanvas";
import HowPlay from "../components/ui/howPlay";
import AIResponse from "../components/AIResponse";
import GenerateQuestionButton from "../components/GenerateQuestionButton";
import UserInfo from "../components/UserInfo";
import { handleGenerateQuestion } from "../helpers/genQues";
import {
  handleDrawingComplete,
  handleUpload,
  handleSendPrompt,
} from "../helpers/handleQuestDrawing";
import Question from "../components/ui/Question";
import useAuth from "../hooks/useAuth";
import useAge from "../hooks/useAge";
import useSkill from "../hooks/useSkill";
import useUserScore from "../hooks/useUserScore";
import useQuestion from "../hooks/useQuestion";

function CreativeQuest() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
  
  const { question, setQuestion } = useQuestion();
  const { setScore } = useUserScore();
  const { ageGroup } = useAge();
  const { skillLevel } = useSkill();
  const user = useAuth();
  const canvasRef = useRef(null);

  const isPage = "CreativeQuest";



  const handleAIResponse = useCallback((responseText) => {
    setResponseText(responseText);
  }, []);

  return (
    <div className="flex flex-col gap-8 bg-black p-4">
      <UserInfo setResponseText={setResponseText} isPage={isPage} />
      {!question && (
        <div>
          <h2 className="text-center text-xl sm:text-2xl my-4 text-white">
            Welcome to{" "}
            <span className="font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Creative Quest
            </span>{" "}
            - Where Every Question Sparks a Masterpiece.
          </h2>
        </div>
      )}
      <div className="flex flex-col md:flex-row items-center justify-stretch mx-auto gap-4 my-6">
        <GenerateQuestionButton
          handleGenerateQuestion={() =>
            handleGenerateQuestion(
              setLoadingQuestion,
              setQuestion,
              setPrompt,
              ageGroup,
              skillLevel,
              canvasRef,
              setResponseText
            )
          }
          loadingQuestion={loadingQuestion}
          question={question}
          responseText={responseText}
        />

        {question && !loadingQuestion && (
          <Question
            question={question}
            className="text-lg font-semibold text-gray-800"
          />
        )}
        {!loadingQuestion && !question && (
          <div className="text-sm sm:text-lg font-semibold text-gray-600">
            Click Generate Question Button to get Question.
          </div>
        )}
        {loadingQuestion && (
          <div className="flex flex-col gap-2">
            <div className="h-2 w-72 bg-gradient-to-r from-red-500 via-amber-400 to-orange-500 mx-auto rounded-full animate-gradient-animate z-50"></div>
          </div>
        )}
      </div>

      {!question && (
        <div className="flex justify-center mt-6 w-full">
          <HowPlay isPage={isPage} className="text-center text-sm text-gray-700" />
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

        {question && (
          <div className="flex flex-col items-center w-full space-y-4">
            <div className="flex  flex-col lg:flex-row justify-between gap-4">

              <div className="bg-background rounded-lg border border-orange-500 p-4 flex flex-col gap-4">


                <DrawingCanvas
                  ref={canvasRef}
                  onDrawingComplete={(dataUrl) =>
                    handleDrawingComplete(dataUrl, setFile)
                  }
                  setIsCanvasEmpty={setIsCanvasEmpty}
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
                  className={`flex-1 px-6 py-3 text-white rounded-full font-semibold transition-colors duration-300 ${isCanvasEmpty || responseText
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-cyan-600"
                    }`}
                  disabled={isCanvasEmpty || responseText}
                >
                  {loadingUpload ? "Uploading..." : "Submit"}
                </button>
              </div>
              <div className="flex justify-center">
                <HowPlay isPage={isPage} className="text-center text-sm text-gray-700" />
              </div>
            </div>
          </div>
        )}
      </div>
      {!question && (
        <div className="flex justify-center">
          <HowPlay className="text-center text-sm text-gray-700" />
        </div>
      )}
    </div>
  );
}

export default CreativeQuest;
