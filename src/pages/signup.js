// /client/src/pages/signup.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "../css/signup.css"; // Make sure the file exists

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.status === 201) {
        alert("✅ Account created!");
        navigate("/login");
      } else if (res.status === 409) {
        alert("⚠️ Email already registered.");
      } else {
        alert("❌ Signup failed.");
        console.error(data.error);
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Server error.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="left-section">
          <h2 className="signup-title">Create Your Account</h2>
          <p className="signup-subtitle">Join us and start your journey</p>

          <div className="input-group">
            <label>Email address</label>
            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="eye-icon"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button className="create-account-btn" onClick={handleSignup}>
            Create Account
          </button>
        </div>

        <div className="right-section">
          <h2>Already have an account?</h2>
          <p>Log in to access your dashboard</p>
          <button className="back-to-login" onClick={() => navigate("/login")}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
