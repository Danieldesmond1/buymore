import { useState } from "react";
import "./styles/Reviews.css";

const Reviews = () => {
  const [filter, setFilter] = useState("all");

  const reviews = [
    { id: 1, name: "John D.", rating: 5, date: "Aug 25, 2025", review: "Amazing product! Fast delivery and great quality." },
    { id: 2, name: "Sarah K.", rating: 4, date: "Aug 22, 2025", review: "Good experience overall, but packaging could be better." },
    { id: 3, name: "Mike L.", rating: 3, date: "Aug 20, 2025", review: "Average product, not exactly what I expected." },
  ];

  const averageRating = 4.2;

  return (
    <div className="reviews-container">
      <h2 className="reviews-title">Customer Reviews</h2>
      <p className="reviews-subtitle">{averageRating} / 5.0 based on {reviews.length} reviews</p>

      {/* Rating Breakdown */}
      <div className="rating-breakdown">
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className="rating-row">
            <span>{star}★</span>
            <div className="bar">
              <div className="bar-fill" style={{ width: `${star * 15}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="reviews-filter">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Reviews</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.map((r) => (
          <div key={r.id} className="review-card">
            <div className="review-header">
              <span className="reviewer-name">{r.name}</span>
              <span className="review-date">{r.date}</span>
            </div>
            <div className="review-rating">
              {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
            </div>
            <p className="review-text">{r.review}</p>
            <button className="reply-btn">Reply</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;