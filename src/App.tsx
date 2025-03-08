import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./global.css";
import HomePage from "./page/HomePage";
import MainPage from "./page/MainPage";
import SwapPage from "page/SwapPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/swap" element={<SwapPage />} />
      </Routes>
    </Router>
  );
}

export default App;
