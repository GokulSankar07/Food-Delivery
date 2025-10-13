import React, { useEffect, useState } from "react";
import "./Cart.css";

const Cart = () => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Remove item from cart
  const handleRemove = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Checkout / Place Order
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty 😔");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      alert("Please login first");
      return;
    }

    // ✅ Ensure restaurantId exists
    const restaurantId = cart[0]?.restaurantId;
    if (!restaurantId) {
      alert("Restaurant not defined for this order!");
      return;
    }

    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

    const newOrder = {
      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      })),
      total: totalPrice,
      status: "Order Placed",
      user: currentUser._id,
      restaurant: restaurantId, // ✅ must be a valid restaurant ObjectId
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to place order");
      }

      const data = await res.json();
      console.log("Order created:", data);

      // Clear cart
      localStorage.removeItem("cart");
      setCart([]);
      alert(`Order placed! Total: ₹${totalPrice}`);
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to place order. Try again.");
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

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
                  {item.restaurantName && (
                    <p style={{ fontStyle: "italic" }}>
                      From: {item.restaurantName}
                    </p>
                  )}
                </div>
                <button onClick={() => handleRemove(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <h2>Total: ₹{totalPrice}</h2>
          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
