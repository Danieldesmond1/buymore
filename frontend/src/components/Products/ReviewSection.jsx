import { useState } from "react";
import "./Styles/ReviewSection.css";

const allReviews = [
  { name: "Chinedu", rating: 5, comment: "Product is solid. Fast delivery. Will buy again!" },
  { name: "Adaobi", rating: 1, comment: "The phone is great but delivery was a bit late." },
  { name: "Tobi", rating: 5, comment: "Legit seller. Exactly as described!" },
  { name: "Amina", rating: 3, comment: "Okay, but not worth the hype." },
  { name: "Uche", rating: 2, comment: "Excellent experience. Highly recommend!" },
  { name: "Chinedu", rating: 5, comment: "Product is solid. Fast delivery. Will buy again!" },
  { name: "Adaobi", rating: 4, comment: "The phone is great but delivery was a bit late." },
  { name: "Tobi", rating: 1, comment: "Legit seller. Exactly as described!" },
  { name: "Amina", rating: 1, comment: "Okay, but not worth the hype." },
  { name: "Uche", rating: 5, comment: "Excellent experience. Highly recommend!" },
  { name: "Chinedu", rating: 5, comment: "Product is solid. Fast delivery. Will buy again!" },
  { name: "Adaobi", rating: 1, comment: "The phone is great but delivery was a bit late." },
  { name: "Tobi", rating: 5, comment: "Legit seller. Exactly as described!" },
  { name: "Amina", rating: 3, comment: "Okay, but not worth the hype." },
  { name: "Uche", rating: 2, comment: "Excellent experience. Highly recommend!" },
  { name: "Chinedu", rating: 5, comment: "Product is solid. Fast delivery. Will buy again!" },
  { name: "Adaobi", rating: 4, comment: "The phone is great but delivery was a bit late." },
  { name: "Tobi", rating: 1, comment: "Legit seller. Exactly as described!" },
  { name: "Amina", rating: 1, comment: "Okay, but not worth the hype." },
  { name: "Uche", rating: 5, comment: "Excellent experience. Highly recommend!" },
];

const ReviewSection = () => {
  const [ratingFilter, setRatingFilter] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState(allReviews);
  const [form, setForm] = useState({ name: "", rating: "", comment: "" });

  const reviewsPerPage = 3;
  const filteredReviews = ratingFilter
    ? reviews.filter(r => r.rating === ratingFilter)
    : reviews;
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const currentReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.rating || !form.comment) return;

    const newReview = {
      name: form.name,
      rating: parseInt(form.rating),
      comment: form.comment
    };

    setReviews([newReview, ...reviews]);
    setForm({ name: "", rating: "", comment: "" });
    setRatingFilter(0);
    setCurrentPage(1);
  };

  return (
    <div className="review-section">
      <h2>Customer Reviews</h2>

      <div className="filter-bar">
        <span>Filter by:</span>
        {[5, 4, 3, 2, 1].map(r => (
          <button
            key={r}
            className={`filter-btn ${ratingFilter === r ? "active" : ""}`}
            onClick={() => setRatingFilter(ratingFilter === r ? 0 : r)}
          >
            {r} ⭐
          </button>
        ))}
      </div>

      {currentReviews.map((review, index) => (
        <div key={index} className="review">
          <div className="review-header">
            <strong>{review.name}</strong>
            <span className="stars">
              {"⭐".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
            </span>
          </div>
          <p className="review-comment">{review.comment}</p>
        </div>
      ))}

      <div className="pagination">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <form className="review-form" onSubmit={handleSubmit}>
        <h3>Leave a Review</h3>
        <input
          type="text"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <select
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: e.target.value })}
          required
        >
          <option value="">Select Rating</option>
          {[5, 4, 3, 2, 1].map(r => (
            <option key={r} value={r}>{r} Stars</option>
          ))}
        </select>
        <textarea
          placeholder="Write your review..."
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          required
        />
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default ReviewSection;
