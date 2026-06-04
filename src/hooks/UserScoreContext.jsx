import React, { createContext, useContext, useState, useEffect } from "react";

import { useAuthContext } from "../context/AuthContext";

const UserScoreContext = createContext();

export const UserScoreProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const { user } = useAuthContext();

  useEffect(() => {
    const storedScore = window.localStorage.getItem("ai-playground-score");
    if (storedScore !== null) {
      setScore(Number(storedScore));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("ai-playground-score", String(score));
  }, [score]);

  useEffect(() => {
    if (user && typeof user.xp === "number") {
      setScore(user.xp);
    }
  }, [user]);

  return (
    <UserScoreContext.Provider value={{ score, setScore }}>
      {children}
    </UserScoreContext.Provider>
  );
};

export const useUserScore = () => {
  return useContext(UserScoreContext);
};
