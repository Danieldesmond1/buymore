import "./Styles/ReviewSection.css";

const reviews = [
  {
    name: "Chinedu",
    rating: 5,
    comment: "Product is solid. Fast delivery. Will buy again!"
  },
  {
    name: "Adaobi",
    rating: 4,
    comment: "The phone is great but delivery was a bit late."
  },
  {
    name: "Tobi",
    rating: 5,
    comment: "Legit seller. Exactly as described!"
  }
];

const ReviewSection = () => {
  return (
    <div className="review-section">
      <h2>Customer Reviews</h2>
      {reviews.map((review, index) => (
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
    </div>
  );
};

export default ReviewSection;
