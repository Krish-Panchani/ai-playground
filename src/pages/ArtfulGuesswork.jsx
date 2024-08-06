import React, { useState, useRef, useEffect, useCallback } from "react";
import DrawingCanvas from "../components/DrawingCanvas";
import HowPlay from "../components/ui/howPlay";
import Header from "../components/Header";
import AIResponse from "../components/AIResponse";
import UserInfo from "../components/UserInfo";
import { handleDrawingComplete, handleUpload, handleSendPrompt } from "../helpers/handleGuessDrawing";
import { auth, firestore } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import useAuth from "../hooks/useAuth";
import Feedback from "../components/Feedback";

function ArtfulGuesswork() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [responseText, setResponseText] = useState("");
  const [question, setQuestion] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [score, setScore] = useState(0);
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
  const [isFeedback, setIsFeedback] = useState("");
  const [uniqueFileName, setUniqueFileName] = useState("");
  const isPage = "ArtfulGuesswork";

  const ageGroups = ["Junior Artist (Age: 12 and below)", "Teen Artist (Age: between 13-19)", "Adult Artist (Age: 20 and above)"];
  const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

  const [ageGroup, setAgeGroup] = useState(ageGroups[0]);
  const [skillLevel, setSkillLevel] = useState(skillLevels[0]);
  const canvasRef = useRef(null);

  const user = useAuth();

  const signOut = useCallback(() => {
    auth.signOut().then(() => {
      console.log("User signed out successfully");
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
  }, []);

  useEffect(() => {
    const fetchUserScore = async () => {
      if (user) {
        console.log("Fetching user score from Firestore: Playground");
        const userDocRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setScore(data.score);
          console.log("User score - Playground:", data.score);
        } else {
          console.log("Creating new user document in Firestore: Playground");
          await setDoc(userDocRef, {
            displayName: user.displayName,
            email: user.email,
            score: 0,
          });
          setScore(0);
        }
      } else {
        console.log("User not signed in: Playground");
        setScore(0);
      }
    };

    fetchUserScore();
  }, [user]);

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
              Artful Guesswork
            </span>{" "}
            - See if AI can identify your creation
          </h2>
        </div>
      )}
      <div className="flex flex-col items-center mb-6 space-y-4">
        {loadingResponse && <p>Loading AI response...</p>}
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
        <div className="flex  flex-col-reverse lg:flex-row justify-between gap-4">
          <div className="flex justify-center">
            <HowPlay isPage={isPage} className="text-center text-sm text-gray-700 " />
          </div>
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
        </div>
      </div>
    </div>
  );
}

export default ArtfulGuesswork;
