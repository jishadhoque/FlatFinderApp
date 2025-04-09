
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import HomePage from "./pages/homepage";
import ListingsPage from "./pages/ListingsPage";
import SignUpPage from "./pages/signup";
import LoginPage from "./pages/login";
import ReviewsPage from "./pages/Reviews";
import Messages from "./pages/messages";
import ViewListingPage from "./pages/ViewListingPage";
import InboxPage from "./pages/InboxPage";
import AddListingPage from "./pages/AddListingPage";

function App() {
    return (
        <Router>
            <Routes>
                {/* Homepage */}
                <Route path="/homepage" element={<HomePage />} />

                {/* Listings */}
                <Route path="/listings" element={<ListingsPage />} />
                  
                <Route path="/listings/:id" element={<ViewListingPage />} />

                {/* Sign up */}
                <Route path="/signup" element={<SignUpPage />} />

                {/* Login */}
                <Route path="/" element={<LoginPage />} />
                  
                <Route path="/add-listing" element={<AddListingPage />} />

                {/* Reviews */}
                <Route path="/reviews" element={<ReviewsPage />} />

                {/* Messages */}
                <Route path="/messages" element={<Messages />} />

                {/* Inbox */}
                <Route path="/inbox" element={<InboxPage />} />

                {/* Add Listing */}
                <Route path="/add-listing" element={<AddListingPage />} />
            </Routes>
        </Router>
    );
}

export default App;
