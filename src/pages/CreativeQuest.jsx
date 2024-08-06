import React, { useState, useRef, useCallback } from "react";
import DrawingCanvas from "../components/DrawingCanvas";
import HowPlay from "../components/ui/howPlay";
import Header from "../components/Header";
import AIResponse from "../components/AIResponse";
import GenerateQuestionButton from "../components/GenerateQuestionButton";
import UserInfo from "../components/UserInfo";
import Footer from "../components/Footer";
import { handleGenerateQuestion } from "../helpers/genQues";
import {
  handleDrawingComplete,
  handleUpload,
  handleSendPrompt,
} from "../helpers/handleUploadDrawing";
import Question from "../components/ui/Question";
import { auth } from "../firebase";
import useAuth from "../hooks/useAuth";
import useAge from "../hooks/useAge";
import useSkill from "../hooks/useSkill";
import useUserScore from "../hooks/useUserScore";

function CreativeQuest() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [responseText, setResponseText] = useState("");
  const [question, setQuestion] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
  
  const [score, setScore] = useUserScore();
  const { ageGroup, setAgeGroup, ageGroups } = useAge();
  const { skillLevel, setSkillLevel, skillLevels } = useSkill();
  const isPage = "CreativeQuest";
  
  const canvasRef = useRef(null);

  const user = useAuth(); // This should work fine here

  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        console.log("User signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  const handleAIResponse = useCallback((responseText) => {
    setResponseText(responseText);
  }, []);

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
        setQuestion={setQuestion}
        setResponseText={setResponseText}
      />
      {!question && (
        <div>
          <h2 className="text-center text-xl sm:text-2xl my-4 text-white">
            Welcome to{" "}
            <span className="font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              AI Playground
            </span>{" "}
            - Where Creativity Meets Learning
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
        {question && (
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
          <div className="h-1 w-60 mb-4 bg-gradient-to-r from-cyan-400 to-green-500 mx-auto rounded-full animate-gradient-animate z-50"></div>
        )}
      </div>
      {!question && (
        <div className="flex justify-center mt-6">
          <HowPlay isPage={isPage} className="text-center text-sm text-gray-700" />
        </div>
      )}
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
        {question && (
          <div className="flex flex-col items-center w-full space-y-4">
            <div className="flex  flex-col-reverse lg:flex-row justify-between gap-4">
              <div className="flex justify-center">
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
        )}
      </div>
      {!question && (
        <div className="flex justify-center">
          <HowPlay className="text-center text-sm text-gray-700" />
        </div>
      )}
      <Footer />
    </div>
  );
}

export default CreativeQuest;
