import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Signin.css"; 

const Signin = () => {
  const [email, setEmail] = useState("");       
  const [password, setPassword] = useState("");
  const navigate = useNavigate();              

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/signin", { email, password })
      .then((res) => {
        if (res.data.message === "Login Successful") {
          const user = res.data.user;
          localStorage.setItem("currentUser", JSON.stringify(user));
          navigate("/home");
        } else {
          alert(res.data.message || "Invalid email or password");
        }
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.message || "Server error");
      });
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
          
<button onClick={() => (window.location.href = "http://localhost:3000/")}>
  Restaurant
</button>

<button onClick={() => (window.location.href = "http://localhost:3001/partner/signin")}>
  Partner
</button>
        </div>
      </div>    
      </form>
    </div>
  );
};

export default Signin;
