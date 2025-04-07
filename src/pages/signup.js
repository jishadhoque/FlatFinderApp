import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "../components/ui/button";
import "../css/signup.css"; // Make sure the path is correct

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleSignup = () => {
    console.log("Creating account with", { email, password });
    // Add logic to call your backend API here
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <div className="signup-container">
      <div className="signup-box">
        {/* Left section - form */}
        <div className="left-section">
          <h2 className="signup-title">Create Your Account</h2>
          <p className="signup-subtitle">Join us and start your journey</p>

          {/* Email Input */}
          <div className="input-group">
            <label>Email address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="input-field"
            />
          </div>

          {/* Password Input with Visibility Toggle */}
          <div className="input-group">
            <label>Password</label>
            <div className="password-container">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="input-field"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="eye-icon"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button className="create-account-btn" onClick={handleSignup}>
            Create Account
          </Button>
        </div>

        {/* Right section - redirect to login */}
        <div className="right-section">
          <h2>Already have an account?</h2>
          <p>Log in to access your dashboard</p>
          <Button className="back-to-login" onClick={() => navigate("/")}>
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}