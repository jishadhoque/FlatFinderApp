import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import "../css/signup.css"; // Make sure the path is correct

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    console.log("Creating account with", { email, password });
    // Add logic to call your backend API here
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        {/* Left section - form */}
        <div className="left-section">
          <h2 className="signup-title">Create Your Account</h2>
          <p className="signup-subtitle">Join us and start your journey</p>

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

          <div className="input-group">
            <label>Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="input-field"
            />
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