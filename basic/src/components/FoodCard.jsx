import React from "react";
import "./FoodCard.css";

const FoodCard = ({ name, price, image, category, onAddToCart }) => {
  return (
    <div className="food-card">
      <img
  src={image}
  alt={name}
  className="food-image"
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src =
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>
        <rect width='100%' height='100%' fill='#f3f4f6'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-size='20'>
          Image unavailable
        </text>
      </svg>`);
  }}
/>
      <h3>{name}</h3>
      {category && <p className="food-category">{category}</p>}
      <p>₹{price}</p>
      <button className="add-btn" onClick={onAddToCart}>
        Add to Cart
      </button>
    </div>
  );
};

export default FoodCard;
