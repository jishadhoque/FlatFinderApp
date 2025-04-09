
// /client/src/pages/homepage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/homepage.css"; // Adjusted path to reflect correct location of homepage.css
 // ✅ Case-sensitive, matches your file name
import supabase from "../config/supabaseClient"; 
import { Link } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  console.log("Supabase client initialized:", supabase);

  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">Find Your Perfect Flat</h1>
        <p className="home-subtitle">
          Discover affordable, comfortable, and conveniently located flats across the city.
        </p>
        <div className="home-buttons">
          <button className="btn browse" onClick={() => navigate("/listings")}>
            Browse Listings
          </button>
          <Link to="/messages" className="btn browse">
            Send Message
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

