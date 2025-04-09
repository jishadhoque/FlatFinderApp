import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import supabase from "../config/supabaseClient"
import "../css/Reviews.css"

// Sample reviews to display if no reviews exist in the database
const sampleReviews = [
  {
    id: "sample-1",
    user_name: "Sarah Johnson",
    user_email: "sarah.j@example.com",
    rating: 5,
    comment:
      "This place was absolutely stunning! The location was perfect - close to restaurants and shops but still quiet and peaceful. The host was very responsive and accommodating. Would definitely stay here again!",
    created_at: "2023-09-15T14:22:00Z",
  },
  {
    id: "sample-2",
    user_name: "Michael Chen",
    user_email: "mchen@example.com",
    rating: 4,
    comment:
      "Great value for the price. The apartment was clean and had all the amenities we needed. The only reason I'm not giving 5 stars is because the WiFi was a bit spotty during our stay. Otherwise, everything was excellent!",
    created_at: "2023-10-02T09:15:00Z",
  },
  {
    id: "sample-3",
    user_name: "Emma Wilson",
    user_email: "emma.w@example.com",
    rating: 5,
    comment:
      "I can't say enough good things about this place! The bed was incredibly comfortable, the kitchen was well-stocked, and the views were breathtaking. The host provided excellent recommendations for local attractions. We'll definitely be back!",
    created_at: "2023-11-20T16:45:00Z",
  },
]

export default function Reviews({ listingId }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [averageRating, setAverageRating] = useState(4.7) // Default average rating for sample reviews
  const [showSampleReviews, setShowSampleReviews] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [listingId])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("listing_id", listingId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching reviews:", error)
        return
      }

      if (data && data.length > 0) {
        setReviews(data)
        setShowSampleReviews(false) // Hide sample reviews if we have real ones

        // Calculate average rating
        const total = data.reduce((sum, review) => sum + review.rating, 0)
        setAverageRating((total / data.length).toFixed(1))
      } else {
        // If no reviews in database, show sample reviews
        setShowSampleReviews(true)
      }
    } catch (err) {
      console.error("Unexpected error fetching reviews:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()

    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    if (!user?.email) {
      setError("You must be logged in to submit a review")
      return
    }

    if (!newReview.comment.trim()) {
      setError("Please enter a comment for your review")
      return
    }

    try {
      setSubmitting(true)
      setError("")

      const { error } = await supabase.from("reviews").insert([
        {
          listing_id: listingId,
          user_email: user.email,
          user_name: user.name || user.email.split("@")[0],
          rating: newReview.rating,
          comment: newReview.comment,
        },
      ])

      if (error) {
        console.error("Error submitting review:", error)
        setError("Failed to submit review. Please try again.")
        return
      }

      // Reset form and show success message
      setNewReview({ rating: 5, comment: "" })
      setSuccess("Your review has been submitted successfully!")
      setShowSampleReviews(false) // Hide sample reviews after submitting a real one

      // Refresh reviews
      fetchReviews()

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (err) {
      console.error("Unexpected error submitting review:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(<Star key={i} size={16} className={i <= rating ? "star-filled" : "star-empty"} />)
    }
    return stars
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const displayedReviews = showSampleReviews ? sampleReviews : reviews
  const reviewCount = displayedReviews.length

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h2>Reviews</h2>
        {reviewCount > 0 && (
          <div className="average-rating">
            <div className="rating-stars">{renderStars(Math.round(averageRating))}</div>
            <span className="rating-number">{averageRating}</span>
            <span className="review-count">({reviewCount} reviews)</span>
          </div>
        )}
      </div>

      {/* Reviews list */}
      <div className="reviews-list">
        {loading ? (
          <div className="loading-message">Loading reviews...</div>
        ) : reviewCount === 0 ? (
          <div className="no-reviews-message">No reviews yet. Be the first to leave a review!</div>
        ) : (
          displayedReviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-name">{review.user_name}</div>
                  <div className="review-date">{formatDate(review.created_at)}</div>
                </div>
                <div className="review-rating">{renderStars(review.rating)}</div>
              </div>
              <div className="review-comment">{review.comment}</div>
            </div>
          ))
        )}
      </div>

      {/* Submit review form */}
      <div className="review-form">
        <h3>Write a Review</h3>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmitReview}>
          <div className="rating-selector">
            <label>Rating</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className="star-btn"
                >
                  <Star size={24} className={star <= newReview.rating ? "star-filled" : "star-empty"} />
                </button>
              ))}
            </div>
          </div>

          <div className="comment-field">
            <label htmlFor="comment">Your Review</label>
            <textarea
              id="comment"
              rows={4}
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share your experience with this property..."
            ></textarea>
          </div>

          <button type="submit" disabled={submitting} className="submit-review-btn">
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  )
}
