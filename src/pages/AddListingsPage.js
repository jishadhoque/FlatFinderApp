"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid" // ✅ IMPORT THIS
import supabase from "../config/supabaseClient"
import "../css/addListing.css"

function AddListingPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [location, setLocation] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg("")

    if (!title || !description || !price || !location || !imageFile) {
      setErrorMsg("Please fill in all fields and choose an image")
      return
    }

    try {
      setIsSubmitting(true)

      // ✅ Generate unique filename
      const fileExt = imageFile.name.split(".").pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `public/${fileName}`

      // ✅ Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, imageFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: imageFile.type,
        })

      if (uploadError) {
        console.error("Upload error:", uploadError)
        throw new Error(`Image upload failed: ${uploadError.message}`)
      }

      // ✅ Get public URL
      const { data: publicURLData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath)

      const imageUrl = publicURLData.publicUrl

      // ✅ Insert listing into Supabase DB
      const { data, error } = await supabase.from("listings").insert([
        {
          title,
          description,
          price: parseFloat(price),
          location,
          imageUrl, // Ensure your DB has a column named imageUrl
        },
      ])

      if (error) {
        throw new Error(`Failed to add listing: ${error.message}`)
      }

      alert("🎉 Listing added successfully!")
      setTimeout(() => navigate("/listings"), 800)

    } catch (error) {
      console.error("❌ Submission error:", error.message)
      setErrorMsg(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="add-listing-page">
      <header className="top-nav">
        <div className="logo" onClick={() => navigate("/homepage")}>🏠 FlatFinder</div>
        <nav>
          <ul>
            <li onClick={() => navigate("/homepage")}>Home</li>
            <li onClick={() => navigate("/listings")}>Search</li>
            <li className="active" onClick={() => navigate("/addListing")}>Add Listings</li>
            <li onClick={() => navigate("/inbox")}>Inbox 🔴</li>
            <li onClick={() => navigate("/")}>Logout</li>
          </ul>
        </nav>
      </header>

      <main className="content">
        <div className="form-container">
          <h2>Add a New Listing</h2>
          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          <form onSubmit={handleSubmit} className="listing-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Enter property title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="Describe your property"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price (£)</label>
                <input
                  id="price"
                  type="number"
                  placeholder="e.g. 150"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  type="text"
                  placeholder="City, Area"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="image">Property Image</label>
              <div className="file-input-container">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                <label htmlFor="image" className="file-input-label">
                  {imageFile ? imageFile.name : "Choose an image"}
                </label>
              </div>

              {previewUrl && (
                <div className="image-preview">
                  <img src={previewUrl || "/placeholder.svg"} alt="Preview" />
                </div>
              )}
            </div>

            <button type="submit" className={isSubmitting ? "submitting" : ""} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Listing"}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default AddListingPage
