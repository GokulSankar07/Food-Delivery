import React, { useEffect, useState } from "react";
import "./OrderTracking.css";

const OrderTracking = () => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
 
    const orderId = localStorage.getItem("currentOrderId");
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${orderId}`);
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };

    fetchOrder();
  }, []);

  if (!order) {
    return (
      <div className="tracking-container">
        <h2>No active order 🚫</h2>
        <p>Please place an order to start tracking.</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>Order Tracking</h1>
      <div className="order-card">
        <h3>Order #{order._id}</h3>
        <ul className="orders-list">
          {order.items.map((item, index) => (
            <li key={index} className="order-item">
              <span>{item.name}</span> – ₹{item.price}
            </li>
          ))}
        </ul>
        <p>Total: ₹{order.total}</p>
        {/* Corrected status display */}
        <p>
          Status: <span className="status-text">{order.status}</span>
        </p>
        <p>Placed on: {new Date(order.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};


export default OrderTracking;
