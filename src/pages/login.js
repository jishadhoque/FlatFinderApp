// /client/src/pages/login.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (
      savedUser &&
      savedUser.email === email &&
      savedUser.password === password
    ) {
      navigate("/listings");
    } else {
      alert("❌ Invalid email or password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back!</h2>
        <p style={{ marginBottom: "30px" }}>please enter your details</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Sign in
          </button>
        </form>

        <div className="extra-buttons">
          <button onClick={() => navigate("/signup")} className="nav-btn">
            Create Account
          </button>
          <button onClick={() => navigate("/")} className="nav-btn">
            Go to Homepage
          </button>
          <button onClick={() => navigate("/listings")} className="nav-btn">
            Browse Listings
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;



