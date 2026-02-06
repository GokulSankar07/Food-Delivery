import React, { useState, useEffect } from "react";
import "./Home.css";
import FoodCard from "../components/FoodCard";
import { Link } from "react-router-dom";
import BASE_URL from "../config";

import pizzaImg from "../assets/images/pizza.webp";
import Biryani from "../assets/images/Biryani.jpeg";
import Burger from "../assets/images/Burger.webp";
import Pasta from "../assets/images/Pasta.webp";
import Dosa from "../assets/images/Dosa.webp";
import Idly from "../assets/images/Idly.webp";
import FriedRice from "../assets/images/FriedRice.webp";
import Manchurian from "../assets/images/Manchurian.webp";
import SpringRoll from "../assets/images/SpringRoll.webp";
import Noodles from "../assets/images/Noodles.webp";

const Home = () => {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(
    localStorage.getItem("selectedRestaurantId") || ""
  );
  const [selectedRestaurantName, setSelectedRestaurantName] = useState(
    localStorage.getItem("selectedRestaurantName") || "Choose Restaurant"
  );

  // Fetch restaurants for runtime selection
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/restaurants`);
        if (!res.ok) throw new Error("Failed to load restaurants");
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setRestaurants(list);

        // Resolve selection: if saved selection exists and matches, keep it; otherwise pick the first
        if (list.length > 0) {
          const match = selectedRestaurantId
            ? list.find((r) => String(r._id) === String(selectedRestaurantId))
            : null;

          const next = match || list[0];
          setSelectedRestaurantId(next._id);
          setSelectedRestaurantName(next.restaurantName || "Selected Restaurant");
          localStorage.setItem("selectedRestaurantId", next._id);
          localStorage.setItem("selectedRestaurantName", next.restaurantName || "Selected Restaurant");
        } else {
          // No restaurants available
          setSelectedRestaurantId("");
          setSelectedRestaurantName("Choose Restaurant");
          localStorage.removeItem("selectedRestaurantId");
          localStorage.removeItem("selectedRestaurantName");
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchRestaurants();
  }, []);

  const restaurantInfo = {
    restaurantId: selectedRestaurantId,
    restaurantName: selectedRestaurantName,
  };

  // Truncate long restaurant names for the navbar to avoid wrapping
  const fullRestaurantName = restaurantInfo.restaurantName || "Choose Restaurant";
  const displayRestaurantName =
    fullRestaurantName.length > 28
      ? fullRestaurantName.slice(0, 28) + "…"
      : fullRestaurantName;

  // Prevent adding items from multiple restaurants
  const handleAddToCart = (food) => {
    if (!restaurantInfo.restaurantId) {
      alert("Please choose a restaurant first.");
      return;
    }
    if (cart.length > 0 && cart[0].restaurantId !== restaurantInfo.restaurantId) {
      alert("You can only order from one restaurant at a time!");
      return;
    }

    const updatedCart = [
      ...cart,
      { ...food, ...restaurantInfo }
    ];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert(`${food.name} added to cart`);
  };

  const foods = [
    { id: 1, name: "Pizza", price: 350, image: pizzaImg, category: "Fast Food" },
    { id: 2, name: "Biryani", price: 200, image: Biryani, category: "Indian" },
    { id: 3, name: "Burger", price: 150, image: Burger, category: "Fast Food" },
    { id: 4, name: "Pasta", price: 250, image: Pasta, category: "Italian" },
    { id: 5, name: "Dosa", price: 120, image: Dosa, category: "South Indian" },
    { id: 6, name: "Idli", price: 100, image: Idly, category: "South Indian" },
    { id: 7, name: "Fried Rice", price: 180, image: FriedRice, category: "Chinese" },
    { id: 8, name: "Manchurian", price: 160, image: Manchurian, category: "Chinese" },
    { id: 9, name: "Spring Roll", price: 140, image: SpringRoll, category: "Chinese" },
    { id: 10, name: "Noodles", price: 170, image: Noodles, category: "Chinese" },
  ];

  const filteredFoods = foods.filter(
    (food) =>
      (category === "All" || food.category === category) &&
      food.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <header className="navbar">
        <h1 className="logo" title={fullRestaurantName}>{displayRestaurantName}</h1>
        <nav className="nav-links">
          <Link to="/cart">🛒 Cart</Link>
          <Link to="/settings">⚙️ Settings</Link>
          <Link to="/about">ℹ️ About</Link>
          <Link to="/order-tracking">📍 Tracking</Link>
          <Link to="/profile">👤 Profile</Link>
        </nav>
      </header>

      <div className="home-container">
      {/* Restaurant selector */}
      <div className="filters" style={{ marginTop: 16 }}>
        <select
          value={selectedRestaurantId}
          onChange={(e) => {
            const id = e.target.value;
            setSelectedRestaurantId(id);
            const match = restaurants.find((r) => String(r._id) === String(id));
            const name = match?.restaurantName || "Choose Restaurant";
            setSelectedRestaurantName(name);
            localStorage.setItem("selectedRestaurantId", id);
            localStorage.setItem("selectedRestaurantName", name);
            // Clear cart if switching restaurants
            if (cart.length && cart[0].restaurantId !== id) {
              setCart([]);
              localStorage.removeItem("cart");
            }
          }}
        >
          <option value="">-- Select Restaurant --</option>
          {restaurants.map((r) => (
            <option key={r._id} value={r._id}>
              {r.restaurantName}
            </option>
          ))}
        </select>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <section className="hero">
        <h2>Delicious food, delivered to you</h2>
        <p>Order from your favorite restaurants and get it delivered fast!</p>
      </section>

      <div className="filters">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All</option>
          <option value="Fast Food">Fast Food</option>
          <option value="Indian">Indian</option>
          <option value="South Indian">South Indian</option>
          <option value="Chinese">Chinese</option>
          <option value="Italian">Italian</option>
          <option value="Snacks">Snacks</option>
          <option value="Dessert">Dessert</option>
          <option value="Beverage">Beverage</option>
        </select>
      </div>

      <h1>Our Menu</h1>
      <div className="food-grid">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food) => (
            <FoodCard
              key={food.id}
              name={food.name}
              price={food.price}
              image={food.image}
              onAddToCart={() => handleAddToCart(food)}
            />
          ))
        ) : (
          <p>No food items found</p>
        )}
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <p>
          Welcome to your restaurant dashboard! Manage your menu, orders, and settings all in one place.
        </p>
        <p>
          Need help? Contact support at {" "}
          <a href="mailto:support@myrestaurant.com">support@myrestaurant.com</a>
        </p>
        <p>© 2025 MyRestaurant. All rights reserved.</p>
      </footer>
      </div>
    </>
  );
};

export default Home;
