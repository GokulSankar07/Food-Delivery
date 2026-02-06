import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";
import BASE_URL from "../config";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Always signup as a "user"
      const newUser = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        phone: phone.trim(),
        role: "user",
      };

      const res = await axios.post(
        `${BASE_URL}/api/users/signup`,
        newUser,
        { headers: { "Content-Type": "application/json" } }
      );

      // ✅ Accept both legacy and corrected backend messages, or HTTP 201
      const msg = res.data?.message;
      const ok = res.status === 201 || msg === "Signup Successful" || msg === "Signin Successful";
      if (ok) {
        localStorage.setItem("currentUser", JSON.stringify(res.data.user));
        alert("Signup successful! Redirecting...");
        navigate("/home");
      } else {
        alert("Signup failed: " + (msg || "Unknown error"));
      }
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message || err);
      alert(err.response?.data?.message || err.message || "Error signing up. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Sign Up</button>

        <p className="already-account">
          Already have an account? <Link to="/signin">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
