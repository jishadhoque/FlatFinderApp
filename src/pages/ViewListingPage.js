import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import "../css/ViewListingPage.css"; // optional for styling

export default function ViewListingPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Failed to fetch listing:", error.message);
        return;
      }

      setListing(data);
    };

    fetchListing();
  }, [id]);

  if (!listing) return <p style={{ padding: "20px" }}>Loading listing...</p>;

  return (
    <div className="view-listing-page">
      <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
      <div className="listing-details">
        <img src={listing.imageUrl} alt={listing.title} className="listing-image" />
        <h2>{listing.title}</h2>
        <p><strong>Location:</strong> {listing.location}</p>
        <p><strong>Price:</strong> £{listing.price}</p>
        <p><strong>Description:</strong> {listing.description}</p>
      </div>
    </div>
  );
}
