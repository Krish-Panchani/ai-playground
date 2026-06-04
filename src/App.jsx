import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import CreativeQuest from "./pages/CreativeQuest";
import ArtfulGuesswork from "./pages/ArtfulGuesswork";
import ArtfulStories from "./pages/ArtfulStories";
import Leaderboard from "./pages/Leaderboard";
import ArtGallery from "./pages/ArtGallery";
import AdventureLog from "./pages/AdventureLog";
import Profile from "./pages/Profile";
import Home from "./pages/Home";

import Header from "./components/Header";
import Footer from "./components/Footer";
import AppToaster from "./components/ui/AppToaster";
import { AuthProvider } from "./context/AuthContext";
import { UserScoreProvider } from "./hooks/UserScoreContext";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <UserScoreProvider>
          <BrowserRouter>
            <AppToaster />
            <div className="flex flex-col min-h-screen bg-black p-4">
              <Header className="mb-4" />
              <Routes>
                <Route index element={<Home />} />
                <Route path="CreativeQuest" element={<CreativeQuest />} />
                <Route path="Profile" element={<Profile />} />
                <Route path="AdventureLog" element={<AdventureLog />} />
                <Route path="ArtfulGuesswork" element={<ArtfulGuesswork />} />
                <Route path="ArtfulStories" element={<ArtfulStories />} />
                <Route path="Leaderboard" element={<Leaderboard />} />
                <Route path="ArtGallery" element={<ArtGallery />} />
              </Routes>
              <Footer />
            </div>
          </BrowserRouter>
        </UserScoreProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
