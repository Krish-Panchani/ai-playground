import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import CreativeQuest from './pages/CreativeQuest';
import ArtfulGuesswork from './pages/ArtfulGuesswork';
import ArtfulStories from './pages/ArtfulStories';
import Leaderboard from './pages/Leaderboard';
import ArtGallery from './pages/ArtGallery';
import Home from './pages/Home';

import Header from './components/Header';
import Footer from './components/Footer';
import { UserScoreProvider } from './hooks/UserScoreContext';

function App() {
  return (
    <UserScoreProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-black p-4">
          <Header className="mb-4" />
          <Routes>
            <Route index element={<Home />} />
            <Route path="CreativeQuest" element={<CreativeQuest />} />
            <Route path="ArtfulGuesswork" element={<ArtfulGuesswork />} />
            <Route path="ArtfulStories" element={<ArtfulStories />} />
            <Route path="Leaderboard" element={<Leaderboard />} />
            <Route path="ArtGallery" element={<ArtGallery />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </UserScoreProvider>
  );
}

export default App;
