import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


// Pages
import HomePage from "./pages/homepage";
import ListingsPage from "./pages/ListingsPage";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup"
// import AddListingPage from "./pages/addListingsPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Homepage (default) */}
        <Route path="/homepage" element={<HomePage />} />

        {/* Listings page */}
        <Route path="/listings" element={<ListingsPage />} />

        <Route path="/signup" element={<SignupPage />} />


        {/* Add Listings page */}
        {/* <Route path="/add-listing" element={<AddListingPage />} /> */}

        {/* Signup page */}

        {/* Login page */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;

