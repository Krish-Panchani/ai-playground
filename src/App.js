import React from 'react';
// import Playground from './pages/Playground';
import CreativeQuest from './pages/CreativeQuest';
import ArtfulGuesswork from './pages/ArtfulGuesswork';
import ArtfulStories from './pages/ArtfulStories';
import Leaderboard from './pages/Leaderboard';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index  element={<Home />} />
        <Route path="CreativeQuest" element={<CreativeQuest />} />
        <Route path="ArtfulGuesswork" element={<ArtfulGuesswork />} />
        <Route path="ArtfulStories" element={<ArtfulStories />} />
        <Route path="Leaderboard" element={<Leaderboard />} />

      </Routes>
    </BrowserRouter>

  );
}

export default App;
