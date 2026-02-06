import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Payment.css";
import BASE_URL from "../config";

const Payment = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (savedCart.length === 0) {
      navigate("/cart");
    }
    setCart(savedCart);
  }, [navigate]);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    const orderData = {
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image || "",
      })),
      total: totalPrice,
      user: currentUser._id,
      restaurant: cart[0]?.restaurantId,
      paymentMethod,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to process payment");
      }

      const data = await response.json();
      localStorage.removeItem("cart");
      navigate(`/order-tracking/${data.order._id}`);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h1>Payment</h1>
      <div className="payment-content">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="order-item">
                <span>{item.name} x {item.quantity || 1}</span>
                <span>₹{item.price * (item.quantity || 1)}</span>
              </li>
            ))}
          </ul>
          <div className="order-total">
            <strong>Total:</strong>
            <strong>₹{totalPrice}</strong>
          </div>
        </div>

        <form onSubmit={handlePayment} className="payment-form">
          <h2>Payment Method</h2>
          <div className="payment-methods">
            <label className="payment-method">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              Credit/Debit Card
            </label>
            <label className="payment-method">
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
              />
              UPI
            </label>
            <label className="payment-method">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on Delivery
            </label>
          </div>

          {paymentMethod === "card" && (
            <div className="card-details">
              <input
                type="text"
                placeholder="Card Number"
                className="card-input"
                required
              />
              <div className="card-row">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="card-input"
                  required
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="card-input"
                  required
                />
              </div>
            </div>
          )}

          {paymentMethod === "upi" && (
            <div className="upi-details">
              <input
                type="text"
                placeholder="UPI ID"
                className="upi-input"
                required
              />
            </div>
          )}

          <button type="submit" className="pay-now-btn" disabled={loading}>
            {loading ? "Processing..." : `Pay ₹${totalPrice}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
