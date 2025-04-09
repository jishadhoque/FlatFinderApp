import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import supabase from "../config/supabaseClient";
import "../css/signup.css";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const { error } = await supabase.from("login").insert([
        {
          email,
          password, // storing raw password
        },
      ]);

      if (error) {
        console.error("❌ Supabase insert error:", error);
        alert("Signup failed: " + error.message);
      } else {
        alert("✅ Account created successfully!");
        navigate("/");
      }
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      alert("Something went wrong. Please try again.");
    }
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

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password" // always hidden
              value={confirmPassword}
              placeholder="Re-enter your password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>


          <button className="create-account-btn" onClick={handleSignup}>
            Create Account
          </button>
        </div>

        <div className="right-section">
          <h2>Already have an account?</h2>
          <p>Log in to access your dashboard</p>
          <button className="back-to-login" onClick={() => navigate("/")}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}