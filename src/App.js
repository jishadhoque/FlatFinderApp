import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


// Pages
import HomePage from "./pages/homepage";
import ListingsPage from "./pages/ListingsPage";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup"
import Messages from "./pages/messages";

function App() {
  return (
    <Router>
      <Routes>
        {/* Homepage (default) */}
        <Route path="/homepage" element={<HomePage />} />

        {/* Listings page */}
        <Route path="/listings" element={<ListingsPage />} />

        <Route path="/signup" element={<SignupPage />} />

        {/* Login page */}
        <Route path="/" element={<LoginPage />} />

        <Route path="/messages" element={<Messages />} />
      </Routes>
    </Router>
  );
}

export default App;

