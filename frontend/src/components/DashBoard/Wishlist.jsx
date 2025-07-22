// Wishlist.jsx
import React from "react";
import "./Styles/Wishlist.css";

const dummyWishlist = [
  {
    id: 1,
    name: "Smartwatch Series X",
    image: "https://via.placeholder.com/100",
    price: "$149.99",
    shop: "TechEmpire",
  },
  {
    id: 2,
    name: "Leather Travel Backpack",
    image: "https://via.placeholder.com/100",
    price: "$89.00",
    shop: "Urban Styles",
  },
];

const Wishlist = () => {
  return (
    <div className="wishlist-container">
      <h2 className="wishlist-title">My Wishlist</h2>
      {dummyWishlist.length === 0 ? (
        <p className="wishlist-empty">Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-items">
          {dummyWishlist.map((item) => (
            <div key={item.id} className="wishlist-card">
              <img src={item.image} alt={item.name} className="wishlist-img" />
              <div className="wishlist-details">
                <h4>{item.name}</h4>
                <p className="wishlist-shop">Store: {item.shop}</p>
                <p className="wishlist-price">{item.price}</p>
                <div className="wishlist-actions">
                  <button className="wishlist-btn add">Add to Cart</button>
                  <button className="wishlist-btn remove">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
