import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css"; 

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");

  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const newUser = { username, 
      email, 
      password,
      phone,
      role,
    };
    const res = await axios.post("http://localhost:5000/api/users/signup", newUser);

 if (res.data.message === "Signup Successful") {
        localStorage.setItem("currentUser", JSON.stringify(res.data.user));
        alert("Signup successful! Redirecting...");

        // Redirect based on role
        if (role === "user") navigate("/home");
        else if (role === "restaurant") navigate(`/restaurant/${res.data.user._id}`);
        else if (role === "partner") navigate(`/partner/${res.data.user._id}`);
      } else {
        alert("Signup failed: " + res.data.message);
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert(err.response?.data?.message || "Error signing up. Please try again.");
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

        {/* Role Selector */}
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="restaurant">Restaurant Owner</option>
          <option value="partner">Delivery Partner</option>
        </select>
        <button type="submit">Sign Up</button>

        <p className="already-account">
          Already have an account? <Link to="/signin">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
