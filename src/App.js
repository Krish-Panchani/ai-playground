import React from 'react';
// import Playground from './pages/Playground';
import CreativeQuest from './pages/CreativeQuest';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index  element={<Home />} />
        <Route path="CreativeQuest" element={<CreativeQuest />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
