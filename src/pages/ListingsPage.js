// /client/src/pages/ListingsPage.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ListingsPage.css";

function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [city, setCity] = useState("London");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/listings?city=${city}&search=${search}`);
        if (!res.ok) throw new Error("Failed to fetch listings");
        const data = await res.json();
        setListings(data);
      } catch (err) {
        console.error("❌ Fetch error:", err.message);
      }
    };

    fetchListings();
  }, [search]);

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
            <li>Inbox 🔴</li>
            <li onClick={() => navigate("/")}>Login</li>
          </ul>
        </nav>
      </header>

      {/* Search bar */}
      <main className="content">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by city, title, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* New Listings */}
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
  return (
    <div className="listing-card">
      <img src={flat.imageUrl} alt={flat.title} />
      <div className="card-content">
        <h4>{flat.title}</h4>
        <p>{flat.location}</p>
        <p><strong>{flat.price}</strong></p>
      </div>
    </div>
  );
}

export default ListingsPage;