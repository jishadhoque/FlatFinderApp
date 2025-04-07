import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ListingsPage.css";

function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [city, setCity] = useState("London");
  const [search, setSearch] = useState("");
  const navigate = useNavigate(); // 🚀 Required for navigation

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/listings?city=${city}&search=${search}`
        );

        if (!res.ok) throw new Error("Failed to fetch listings");

        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.error("❌ Error fetching listings:", error.message);
      }
    };

    fetchListings();
  }, [city, search]);

  return (
    <div className="listings-container">
      <div className="listings-header">
        <h2>Flats in {city}</h2>
        <button
          className="login-button"
          onClick={() => navigate("/login")}
          title="Login to your account"
        >
          👤
        </button>
      </div>

      <div className="filters">
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option>London</option>
          <option>Manchester</option>
          <option>Brighton</option>
        </select>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or description..."
        />
      </div>

      <div className="listings-grid">
        {listings.length > 0 ? (
          listings.map((flat) => (
            <div key={flat.id} className="listing-card">
              <img
                src={flat.imageUrl}
                alt={flat.title}
                className="listing-image"
              />
              <div className="listing-content">
                <h3>{flat.title}</h3>
                <p>{flat.description}</p>
                <p><strong>Location:</strong> {flat.location}</p>
                <p><strong>Address:</strong> {flat.address}</p>
                <p><strong>Price:</strong> {flat.price}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No listings found.</p>
        )}
      </div>
    </div>
  );
}

export default ListingsPage;

