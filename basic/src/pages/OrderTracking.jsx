import React, { useEffect, useState } from "react";
import "./OrderTracking.css";
import BASE_URL from "../config";

const OrderTracking = ({ moduleType = "user" }) => {
  // moduleType = "user" | "restaurant" | "partner"
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let idKey = ""; 
        let url = "";

        if (moduleType === "user") idKey = "currentUser";
        if (moduleType === "restaurant") idKey = "currentRestaurant";
        if (moduleType === "partner") idKey = "currentPartner";

        const stored = JSON.parse(localStorage.getItem(idKey));
        if (!stored) return;

        const entityId = stored._id;

        if (moduleType === "user") {
          url = `${BASE_URL}/api/orders/user/${entityId}`;
        } else if (moduleType === "restaurant") {
          // Align with existing restaurant orders route
          url = `${BASE_URL}/api/restaurantOrders/${entityId}/orders`;
        } else if (moduleType === "partner") {
          // Matches backend: app.use('/api/partner', ...) then '/:partnerId/orders'
          url = `${BASE_URL}/api/partner/${entityId}/orders`;
        }

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to fetch orders (${res.status})`);
        }

        const data = await res.json();
        // Handle both array and wrapped response shapes, then sort newest first
        const next = Array.isArray(data)
          ? data
          : Array.isArray(data?.orders)
          ? data.orders
          : [];
        next.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(next);
        setError("");
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Optional: Setup live updates via Socket.IO
    /*
    const socket = io("${BASE_URL}");
    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
    });
    return () => socket.disconnect();
    */
  }, [moduleType]);

  if (loading) return <div className="tracking-container">Loading...</div>;
  if (error) return <div className="tracking-container"><h2>{error}</h2></div>;
  if (!orders.length)
    return (
      <div className="tracking-container">
        <h2>No orders found 🚫</h2>
      </div>
    );

  return (
    <div className="orders-container">
      <h1>Orders</h1>
      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <h3>Order #{order._id}</h3>
          <ul className="orders-list">
            {order.items.map((item, idx) => (
              <li key={idx} className="order-item">
                <span>{item.name}</span> – ₹{item.price}
              </li>
            ))}
          </ul>
          <p>Total: ₹{order.total}</p>
          <p>
            Status: <span className="status-text">{order.status}</span>
          </p>
          <p>Placed on: {new Date(order.createdAt).toLocaleString()}</p>
          {moduleType === "restaurant" && order.assignedPartner && (
            <p>
              Assigned Partner: {order.assignedPartner.name} (
              {order.assignedPartner.email})
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderTracking;
