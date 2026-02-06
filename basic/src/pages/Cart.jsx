import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const handleRemove = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleProceedToPayment = () => {
    if (!cart.length) {
      alert("Your cart is empty");
      return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      alert("Please login first");
      navigate("/signin");
      return;
    }
    
    navigate("/payment");
  };
  
  const handleBuyNow = (item) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      alert("Please login first");
      navigate("/signin");
      return;
    }
    
    // Set cart to contain only the selected item
    const singleItemCart = [{
      ...item,
      quantity: 1
    }];
    
    localStorage.setItem("cart", JSON.stringify(singleItemCart));
    navigate("/payment");
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <p>₹{item.price}</p>
                  {item.restaurantName && <p>From: {item.restaurantName}</p>}
                </div>
                <div className="item-actions">
                  <button className="buy-now-btn" onClick={(e) => {
                    e.stopPropagation();
                    handleBuyNow(item);
                  }}>
                    Buy Now
                  </button>
                  <button className="remove-btn" onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item.id);
                  }}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-actions">
            <h2>Total: ₹{totalPrice}</h2>
            <button className="checkout-btn" onClick={handleProceedToPayment}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
