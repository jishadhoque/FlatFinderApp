import React from "react";
import SignupPage from "./pages/signup.js"; 
import LoginPage from "./pages/login.js";
import HomePage from "./pages/homepage.js"; 
// Make sure the file is named Login.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css"; // Optional if you use global styles

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/homepage" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
