// /client/src/pages/homepage.js
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/homepage.css";
import supabase from "../config/supabaseClient";

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
                    <button className="btn browse" onClick={() => navigate("/signup")}>
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;