import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient"; // ✅ FIXED: Import at the top
import "../css/ListingsPage.css";

function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .ilike("location", `%${search}%`); // You can change to "title" too

        if (error) throw error;

        setListings(data);
      } catch (err) {
        console.error("❌ Supabase fetch error:", err.message);
      }
    };

    fetchListings();
  }, [search]); // Triggers when search changes

  return (
    <div className="top-layout">
      {/* Top Navigation Bar */}
      <header className="top-nav">
        <div className="logo" onClick={() => navigate("/homepage")}>🏠 FlatFinder</div>
        <nav>
          <ul>
            <li onClick={() => navigate("/homepage")}>Home</li>
            <li onClick={() => navigate("/listings")}>Search</li>
            <li onClick={() => navigate("/add-listing")}>Add Listings</li>
            <li onClick={() => navigate("/inbox")}>Inbox</li>
            <li onClick={() => navigate("/")}>Logout</li>
          </ul>
        </nav>
      </header>

      {/* Search bar */}
      <main className="content">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Listings Section */}
        <section>
          <h3>New Listings</h3>
          <div className="listing-grid">
            {listings.length > 0 ? (
              listings.map((flat) => (
                <ListingCard key={flat.id} flat={flat} />
              ))
            ) : (
              <p>No listings found.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function ListingCard({ flat }) {
  const navigate = useNavigate();

  return (
    <div
      className="listing-card"
      onClick={() => navigate(`/listing/${flat.id}`)}
      style={{ cursor: "pointer" }} // visually looks clickable
    >
      <div className="image-wrapper">
        <img src={flat.imageUrl} alt={flat.title} />
      </div>
      <div className="card-content">
        <h4 className="listing-title">{flat.title}</h4>
        <p className="listing-location">{flat.location}</p>
        <p className="listing-price">£{flat.price}</p>
      </div>
    </div>
  );
}

export default ListingsPage;
