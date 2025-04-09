import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// Pages
import HomePage from "./pages/homepage"
import ListingsPage from "./pages/ListingsPage"
import LoginPage from "./pages/login"
import SignupPage from "./pages/signup"
import ViewListingPage from "./pages/ViewListingPage"
import InboxPage from "./pages/InboxPage"
import AddListingPage from "./pages/AddListingsPage"

function App() {
  return (
    <Router>
      <Routes>
        {/* Homepage (default) */}
        <Route path="/homepage" element={<HomePage />} />

        {/* Listings page */}
        <Route path="/listings" element={<ListingsPage />} />

        <Route path="/signup" element={<SignupPage />} />

        <Route path="/listing/:id" element={<ViewListingPage />} />

        {/* Inbox page */}
        <Route path="/inbox" element={<InboxPage />} />

        <Route path="/add-listing" element={<AddListingPage />} />

        {/* Login page */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App
