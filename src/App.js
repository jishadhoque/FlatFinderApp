import React from "react";
import SignupPage from "./pages/signup.js"; // Correct the casing here if the file is actually named signup.js
import LoginPage from "./pages/login.js"; // Correct the casing here if the file is actually named login.js
// Make sure the file is named Login.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css"; // Optional if you use global styles

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;
