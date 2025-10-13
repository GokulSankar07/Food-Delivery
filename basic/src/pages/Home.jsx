import React, { useState, useEffect } from "react";
import "./Home.css";
import FoodCard from "../components/FoodCard";
import { Link } from "react-router-dom";

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

  // Example restaurant info (replace with real MongoDB _id)
  const restaurantInfo = {
    restaurantId: "650abcd1234567890ef12345", // backend restaurant _id
    restaurantName: "FoodieExpress",
  };

  // Prevent adding items from multiple restaurants
  const handleAddToCart = (food) => {
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
    <div className="home-container">
      <header className="navbar">
        <h1 className="logo">{restaurantInfo.restaurantName}</h1>
        <nav className="nav-links">
          <Link to="/cart">Cart</Link>
          <Link to="/settings">Settings</Link>
          <Link to="/about">About</Link>
          <Link to="/order-tracking">Order Tracking</Link>
          <Link to="/profile">Profile</Link>
        </nav>
      </header>

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
    </div>
  );
};

export default Home;
