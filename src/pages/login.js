import supabase from "../config/supabaseClient";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";

function LoginPage() {
  const [fetchError, setFetchError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();
      
      const { data, error } = await supabase
        .from("login")
        .select("*")
        .eq("email", email)
        .single();

        console.log("Input Email:", cleanEmail);
        console.log("Input Password:", cleanPassword);
        console.log("Fetched Supabase Data:", data);
        console.log("Fetch Error (if any):", error);


      if (error || !data) {
        alert("User not found");
        return;
      }

      if (data.password === password) {
        alert("Login successful!");
        localStorage.setItem("user", JSON.stringify(data)); // Optional
        navigate("/listings");
      } else {
        alert("Incorrect password");
      }
    } catch (err) {
      console.error("Login error:", err.message);
      setFetchError("Something went wrong during login");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back!</h2>
        <p style={{ marginBottom: "30px" }}>Please enter your details</p>

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
          <button onClick={() => navigate("/listings")} className="nav-btn">
            Browse Listings
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;