//import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import supabase from "../config/supabaseClient"; // Adjust the path as necessary
// import "../css/addListing.css";

// export default function AddListingPage() {
//   const [title, setTitle] = useState("");
//   const [location, setLocation] = useState("");
//   const [price, setPrice] = useState("");
//   const [imageUrl, setImageUrl] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Here you'd usually insert into Supabase or your backend
//     console.log("New listing:", {
//       title,
//       location,
//       price,
//       imageUrl,
//     });

//     alert("✅ Listing submitted!");

//     // Reset form
//     setTitle("");
//     setLocation("");
//     setPrice("");
//     setImageUrl("");
//   };

//   return (
//     <div className="add-listing-container">
//       <h2>Add a New Listing</h2>
//       <form onSubmit={handleSubmit} className="add-listing-form">
//         <label>Title</label>
//         <input
//           type="text"
//           placeholder="Cozy flat in London"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />

//         <label>Location</label>
//         <input
//           type="text"
//           placeholder="City or Area"
//           value={location}
//           onChange={(e) => setLocation(e.target.value)}
//           required
//         />

//         <label>Price</label>
//         <input
//           type="number"
//           placeholder="e.g. 800"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           required
//         />

//         <label>Image URL</label>
//         <input
//           type="url"
//           placeholder="https://example.com/image.jpg"
//           value={imageUrl}
//           onChange={(e) => setImageUrl(e.target.value)}
//         />

//         <button type="submit">Add Listing</button>
//       </form>
//     </div>
//   );
// }
