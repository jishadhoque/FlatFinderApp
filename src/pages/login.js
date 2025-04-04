import { useState } from "react";
import { Input } from "../components/ui/input"; // Ensure correct path
import { Button } from "../components/ui/button"; // Ensure correct path
import { Eye, EyeOff } from "lucide-react";
import "../css/login.css"; // Ensure correct CSS import

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    console.log("Logging in with", { email, password });
  };

  const handleCreateAccount = () => {
    console.log("Redirect to create account page");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Left Section - Login Form */}
        <div className="left-section">
          <h2 className="title">Welcome Back!</h2>
          <p className="subtitle">Please enter your details</p>
          
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

          {/* Sign In Button */}
          <Button type="button" className="sign-in-btn" onClick={handleLogin}>
            Sign in
          </Button>
        </div>

        {/* Right Section - Signup Prompt */}
        <div className="right-section">
          <h2 className="new-title">New Here?</h2>
          <p className="new-text">Find the perfect stay, sign up now to book with ease!</p>
          <Button type="button" className="sign-up-btn" onClick={handleCreateAccount}>
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
}

