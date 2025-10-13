import React from "react";
import "./FoodCard.css";

const FoodCard = ({ name, price, image, category, onAddToCart }) => {
  return (
    <div className="food-card">
      <img src={image} alt={name} className="food-image" />
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
