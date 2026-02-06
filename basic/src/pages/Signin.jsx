import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Signin.css";
import BASE_URL from "../config";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const RESTAURANT_APP_URL = import.meta.env.VITE_RESTAURANT_APP_URL || "http://localhost:3000/";
  const PARTNER_APP_URL = import.meta.env.VITE_PARTNER_APP_URL || "http://localhost:3001/partner/signin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login attempt with email:", email.trim().toLowerCase());
    console.log("BASE_URL:", BASE_URL);
    console.log("Full API URL:", `${BASE_URL}/api/users/signin`);
    
    try {
      console.log("Making API request...");
      const res = await axios.post(
        `${BASE_URL}/api/users/signin`,
        {
          email: email.trim().toLowerCase(),
          password: password.trim(),
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 30000, // 30 second timeout for Render wake-up
        }
      );

      console.log("API Response:", res.data);

      if (res.data.message === "Signin Successful") {
        const user = res.data.user;
        localStorage.setItem("currentUser", JSON.stringify(user));
        navigate("/home");
      } else {
        console.log("Login failed:", res.data.message);
        alert(res.data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Signin error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Error code:", err.code);
      console.error("Error message:", err.message);
      
      if (err.code === 'ECONNABORTED') {
        alert("Request timed out. The backend server is waking up. Please try again in 30 seconds.");
      } else if (err.response?.status === 0) {
        alert("Network error. Please check your internet connection.");
      } else {
        alert(err.response?.data?.message || err.message || "Server error");
      }
    }
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>

        <p className="already-account">
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>

        <div className="switch-user">
          <p>Login as another user:</p>
          <div className="switch-links">
            <button
              type="button"
              onClick={() => (window.location.href = RESTAURANT_APP_URL)}
            >
              Restaurant
            </button>
            <button
              type="button"
              onClick={() => (window.location.href = PARTNER_APP_URL)}
            >
              Partner
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Signin;
