import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [wishlist, setWishlist] = useState([]);

  // Load user info from localStorage and wishlist
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (savedUser) setUser(savedUser);

    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentOrderId");
    navigate("/signin");
  };

  // Remove item from wishlist
  const removeFromWishlist = (id) => {
    const updated = wishlist.filter((item) => item.id !== id && item._id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  // Move item from wishlist to cart
  const moveToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    removeFromWishlist(item.id || item._id);
  };

  return (
    <div className="profile-container">
      {/* User Info */}
      {user && (
        <div className="user-info">
          <h2>Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
        </div>
      )}

      {/* Quick Links */}
      <div className="quick-links">
        <button onClick={() => navigate("/cart")}>Go to Cart</button>
        <button onClick={() => navigate("/order-tracking")}>Track Orders</button>
        <button onClick={() => navigate("/settings")}>Settings</button>
      </div>

      {/* Wishlist */}
      <div className="wishlist-section">
        <h3>Your Wishlist</h3>
        {wishlist.length === 0 ? (
          <p>No items in wishlist.</p>
        ) : (
          <ul className="wishlist-list">
            {wishlist.map((item) => (
              <li key={item.id || item._id} className="wishlist-item">
                <span>
                  {item.name} – ₹{item.price}
                </span>
                <div>
                  <button onClick={() => moveToCart(item)}>Add to Cart</button>
                  <button onClick={() => removeFromWishlist(item.id || item._id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Logout */}
      <div className="logout-section">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
