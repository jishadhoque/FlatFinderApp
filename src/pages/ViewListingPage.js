"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import supabase from "../config/supabaseClient"
import { ChevronLeft, ChevronRight, Flag, X } from "lucide-react"
import "../css/ViewListingPage.css"
import Reviews from "./reviews"
import "../css/reviews.css"

export default function ViewListingPage() {
  const { id } = useParams()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDates, setSelectedDates] = useState({
    checkIn: new Date(2025, 3, 27), // April 27, 2025
    checkOut: new Date(2025, 4, 2), // May 2, 2025
  })
  const [showCalendar, setShowCalendar] = useState(false)
  const [guests, setGuests] = useState(1)
  const [showGuestDropdown, setShowGuestDropdown] = useState(false)
  const [showReservePopup, setShowReservePopup] = useState(false)
  const [reservationConfirmed, setReservationConfirmed] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reservationError, setReservationError] = useState("")
  const [activeTab, setActiveTab] = useState("photos")
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false)

  const navigate = useNavigate()

  // Add this sample amenities data (you can replace with your actual data)
  const amenities = [
    "Wifi",
    "Kitchen",
    "Washer",
    "Dryer",
    "Air conditioning",
    "Heating",
    "Dedicated workspace",
    "TV",
    "Hair dryer",
    "Iron",
    "Pool",
    "Hot tub",
    "Free parking",
    "EV charger",
    "Crib",
    "Gym",
    "BBQ grill",
    "Breakfast",
    "Indoor fireplace",
    "Smoking allowed",
  ]

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("listings").select("*").eq("id", id).single()

      if (error) {
        console.error("Failed to fetch listing:", error.message)
        setLoading(false)
        return
      }

      setListing(data)
      setLoading(false)
    }

    fetchListing()
  }, [id])

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay()
  }

  const handleDateClick = (day, month, year) => {
    const clickedDate = new Date(year, month, day)

    if (!selectedDates.checkIn || (selectedDates.checkIn && selectedDates.checkOut)) {
      // Start a new selection
      setSelectedDates({
        checkIn: clickedDate,
        checkOut: null,
      })
    } else if (clickedDate > selectedDates.checkIn) {
      // Complete the selection
      setSelectedDates({
        ...selectedDates,
        checkOut: clickedDate,
      })
      setShowCalendar(false)
    } else {
      // Clicked before check-in, start new selection
      setSelectedDates({
        checkIn: clickedDate,
        checkOut: null,
      })
    }
  }

  const isDateInRange = (day, month, year) => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) return false

    const date = new Date(year, month, day)
    return date >= selectedDates.checkIn && date <= selectedDates.checkOut
  }

  const isCheckInDate = (day, month, year) => {
    if (!selectedDates.checkIn) return false

    const date = new Date(year, month, day)
    return date.getTime() === selectedDates.checkIn.getTime()
  }

  const isCheckOutDate = (day, month, year) => {
    if (!selectedDates.checkOut) return false

    const date = new Date(year, month, day)
    return date.getTime() === selectedDates.checkOut.getTime()
  }

  const clearDates = () => {
    setSelectedDates({
      checkIn: null,
      checkOut: null,
    })
  }

  const calculateNights = () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) return 0

    const diffTime = Math.abs(selectedDates.checkOut - selectedDates.checkIn)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const renderCalendar = (month, year) => {
    const daysInMonth = getDaysInMonth(month, year)
    const firstDay = getFirstDayOfMonth(month, year)
    const monthName = new Date(year, month).toLocaleString("default", { month: "long" })

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isInRange = isDateInRange(day, month, year)
      const isCheckIn = isCheckInDate(day, month, year)
      const isCheckOut = isCheckOutDate(day, month, year)

      days.push(
        <div
          key={`day-${day}`}
          className={`calendar-day ${isInRange ? "in-range" : ""} ${isCheckIn ? "check-in" : ""} ${
            isCheckOut ? "check-out" : ""
          }`}
          onClick={() => handleDateClick(day, month, year)}
        >
          {day}
        </div>,
      )
    }

    return (
      <div className="calendar-month">
        <div className="calendar-header">
          <h3>
            {monthName} {year}
          </h3>
        </div>
        <div className="calendar-weekdays">
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>
        <div className="calendar-days">{days}</div>
      </div>
    )
  }

  const handleReserve = () => {
    // Validate dates before showing popup
    if (!selectedDates.checkIn || !selectedDates.checkOut) {
      // Use our custom popup instead of alert
      setReservationError("Please select both check-in and check-out dates before reserving.")
      setShowReservePopup(true)
      return
    }

    // Clear any previous errors
    setReservationError("")
    setShowReservePopup(true)
  }

  const confirmReservation = async () => {
    // If there's an error message showing, just close the popup when user clicks Reserve
    if (reservationError) {
      setShowReservePopup(false)
      setReservationError("")
      return
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}")

    if (!user?.email) {
      setReservationError("You must be logged in to make a reservation.")
      return
    }

    try {
      const { error } = await supabase.from("reservations").insert([
        {
          user_email: user.email,
          listing_id: listing.id,
          check_in: selectedDates.checkIn.toISOString().split("T")[0],
          check_out: selectedDates.checkOut.toISOString().split("T")[0],
          guests,
          total_price: listing.price * calculateNights(),
        },
      ])

      if (error) {
        console.error("❌ Supabase reservation error:", error.message)
        setReservationError("Failed to save reservation. Please try again.")
      } else {
        setReservationConfirmed(true)
        setTimeout(() => {
          setShowReservePopup(false)
          setReservationConfirmed(false)
        }, 3000)
      }
    } catch (err) {
      console.error("❌ Unexpected error:", err)
      setReservationError("An unexpected error occurred while reserving.")
    }
  }

  const handleReportSubmit = () => {
    if (reportReason.trim() === "") {
      alert("Please provide a reason for reporting this listing.")
      return
    }

    // Here you would typically send the report to your backend
    alert("Thank you for your report. We will review it shortly.")
    setShowReportModal(false)
    setReportReason("")
  }

  if (loading) return <div className="loading-container">Loading listing details...</div>

  if (!listing) return <div className="error-container">Listing not found</div>

  const nights = calculateNights()
  const totalPrice = listing.price * nights
  const serviceFee = Math.round(totalPrice * 0.15)
  const grandTotal = totalPrice + serviceFee

  return (
    <div className="view-listing-container">
      {/* Amenities Modal */}
      {showAmenitiesModal && (
        <div className="popup-overlay">
          <div className="popup-content amenities-modal">
            <button className="close-popup" onClick={() => setShowAmenitiesModal(false)}>
              <X size={16} />
            </button>
            <h3 className="amenities-modal-title">Amenities</h3>
            <div className="amenities-list">
              {amenities.map((amenity, index) => (
                <div key={index} className="amenity-item">
                  {amenity}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reservation Popup */}
      {showReservePopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button
              className="close-popup"
              onClick={() => {
                setShowReservePopup(false)
                setReservationError("")
              }}
            >
              <X size={16} />
            </button>

            {reservationConfirmed ? (
              <div className="confirmation-message">
                <h3>✅ Reservation Confirmed!</h3>
                <p>Your stay has been reserved! You will receive a confirmation email shortly.</p>
                <p>If you wish to cancel this booking, please email us at:</p>
                <p className="contact-email">fdmgroup46@gmail.com</p>
              </div>
            ) : reservationError ? (
              <div className="confirmation-message">
                <h3 style={{ color: "#e31c5f" }}>⚠️ Error</h3>
                <p>{reservationError}</p>
                <button
                  className="confirm-btn"
                  style={{ marginTop: "15px" }}
                  onClick={() => {
                    setShowReservePopup(false)
                    setReservationError("")
                  }}
                >
                  OK
                </button>
              </div>
            ) : listing ? (
              <>
                <h3 style={{ textAlign: "center", marginBottom: "15px", fontSize: "18px" }}>
                  Confirm Your Reservation
                </h3>

                <div className="popup-listing-summary">
                  <img
                    src={listing.imageUrl || "/placeholder.svg"}
                    alt={listing.title}
                    className="popup-listing-image"
                  />
                  <div className="popup-listing-details">
                    <h4>{listing.title}</h4>
                    <p>{listing.location}</p>
                  </div>
                </div>

                <div className="popup-reservation-details">
                  <div className="popup-detail-item">
                    <span>Dates:</span>
                    <span>
                      {selectedDates.checkIn ? formatDate(selectedDates.checkIn) : "Not set"} -{" "}
                      {selectedDates.checkOut ? formatDate(selectedDates.checkOut) : "Not set"}
                    </span>
                  </div>

                  <div className="popup-detail-item">
                    <span>Guests:</span>
                    <span>
                      {guests} guest{guests !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="popup-detail-item">
                    <span>Price ({nights} nights):</span>
                    <span>£{totalPrice}</span>
                  </div>

                  <div className="popup-detail-item">
                    <span>Service fee:</span>
                    <span>£{serviceFee}</span>
                  </div>

                  <div className="popup-detail-item total">
                    <span>Total:</span>
                    <span>£{grandTotal}</span>
                  </div>
                </div>

                <div className="popup-actions">
                  <button className="confirm-btn" onClick={confirmReservation}>
                    Reserve Now
                  </button>
                  <button className="cancel-btn" onClick={() => setShowReservePopup(false)}>
                    Cancel
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      <div className="listing-navigation">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ChevronLeft size={16} /> Back
        </button>
        <div className="listing-nav-tabs">
          <button
            className={`nav-tab ${activeTab === "photos" ? "active" : ""}`}
            onClick={() => setActiveTab("photos")}
          >
            Photos
          </button>
          <button
            className={`nav-tab ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
        </div>
      </div>

      <div className="listing-content">
        <div className="listing-details">
          {activeTab === "photos" ? (
            <>
              <img src={listing.imageUrl || "/placeholder.svg"} alt={listing.title} className="listing-image" />

              <h1 className="listing-title">{listing.title}</h1>
              <p className="listing-location">{listing.location}</p>

              <div className="listing-section">
                <h2>Description</h2>
                <p className="listing-description">{listing.description}</p>
              </div>

              <div className="listing-section">
                <h2>Amenities</h2>
                <button className="show-all-btn" onClick={() => setShowAmenitiesModal(true)}>
                  Show all 35 amenities
                </button>
              </div>

              <div className="date-range-display">
                <h2>
                  {nights} nights in {listing.location.split(",")[0]}
                </h2>
                <p>
                  {selectedDates.checkIn
                    ? selectedDates.checkIn.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Select check-in"}{" "}
                  -{" "}
                  {selectedDates.checkOut
                    ? selectedDates.checkOut.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Select check-out"}
                </p>

                {showCalendar && (
                  <div className="calendar-container">
                    <div className="calendar-navigation">
                      <button onClick={prevMonth} className="calendar-nav-btn">
                        <ChevronLeft size={16} />
                      </button>
                      <button onClick={nextMonth} className="calendar-nav-btn">
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    <div className="calendars-wrapper">
                      {renderCalendar(currentMonth, currentYear)}
                      {renderCalendar((currentMonth + 1) % 12, currentMonth === 11 ? currentYear + 1 : currentYear)}
                    </div>

                    <button onClick={clearDates} className="clear-dates-btn">
                      Clear dates
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Reviews listingId={id} />
          )}
        </div>

        <div className="booking-card">
          <div className="price-container">
            <div className="price-display">
              <span className="price">{listing.price}</span>
              <span className="price-unit">night</span>
            </div>
          </div>

          <div className="booking-form">
            <div className="date-picker-container">
              <div className="date-inputs">
                <div className="date-input" onClick={() => setShowCalendar(!showCalendar)}>
                  <label>CHECK-IN</label>
                  <div>{selectedDates.checkIn ? formatDate(selectedDates.checkIn) : "Add date"}</div>
                </div>
                <div className="date-input" onClick={() => setShowCalendar(!showCalendar)}>
                  <label>CHECKOUT</label>
                  <div>{selectedDates.checkOut ? formatDate(selectedDates.checkOut) : "Add date"}</div>
                </div>
              </div>

              <div className="guests-dropdown-container">
                <div className="guests-input" onClick={() => setShowGuestDropdown(!showGuestDropdown)}>
                  <label>GUESTS</label>
                  <div className="guests-display">
                    {guests} guest{guests !== 1 ? "s" : ""}
                    <span className={`dropdown-arrow ${showGuestDropdown ? "open" : ""}`}></span>
                  </div>
                </div>

                {showGuestDropdown && (
                  <div className="guests-dropdown">
                    <div className="guest-type">
                      <div>
                        <h4>Adults</h4>
                        <p>Ages 13+</p>
                      </div>
                      <div className="guest-counter">
                        <button onClick={() => guests > 1 && setGuests(guests - 1)} disabled={guests <= 1}>
                          -
                        </button>
                        <span>{guests}</span>
                        <button onClick={() => setGuests(guests + 1)}>+</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button className="reserve-btn" onClick={handleReserve}>
              Reserve
            </button>

            <p className="no-charge-text">You won't be charged yet</p>

            <div className="price-breakdown">
              <div className="price-item">
                <span>
                  {listing.price} x {nights} nights
                </span>
                <span>{totalPrice}</span>
              </div>
              <div className="price-item">
                <span>Service fee</span>
                <span>{serviceFee}</span>
              </div>
            </div>

            <div className="total-price">
              <span>Total</span>
              <span>{grandTotal}</span>
            </div>
          </div>

          <div className="report-listing">
            <button className="report-btn" onClick={() => setShowReportModal(true)}>
              <Flag size={16} /> Report this listing
            </button>
          </div>
        </div>
      </div>

      {/* Report Listing Modal */}
      {showReportModal && (
        <div className="modal-overlay">
          <div className="report-modal">
            <div className="modal-header">
              <h3>Report this listing</h3>
              <button className="close-modal" onClick={() => setShowReportModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>Please tell us what's wrong with this listing:</p>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Describe the issue..."
                rows={5}
              ></textarea>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowReportModal(false)}>
                Cancel
              </button>
              <button className="submit-report-btn" onClick={handleReportSubmit}>
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
