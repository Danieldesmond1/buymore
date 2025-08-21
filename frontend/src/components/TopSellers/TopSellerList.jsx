import { useState } from "react";
import TopSellerCard from "./TopSellerCard";
import "./styles/TopSellerList.css";

const dummySellers = [
  {
    id: 1,
    name: "Tech World",
    logo: "https://via.placeholder.com/80x80.png?text=TW",
    banner: "https://via.placeholder.com/600x200.png?text=Tech+World",
    rating: 4.8,
    sales: 12500,
    location: "Lagos, Nigeria",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Fashion Hub",
    logo: "https://via.placeholder.com/80x80.png?text=FH",
    banner: "https://via.placeholder.com/600x200.png?text=Fashion+Hub",
    rating: 4.6,
    sales: 9800,
    location: "Abuja, Nigeria",
    badge: "Trusted",
  },
  {
    id: 3,
    name: "Gadget Pro",
    logo: "https://via.placeholder.com/80x80.png?text=GP",
    banner: "https://via.placeholder.com/600x200.png?text=Gadget+Pro",
    rating: 4.9,
    sales: 15700,
    location: "Port Harcourt, Nigeria",
    badge: "Top Rated",
  },
];

const TopSellerList = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("none");

  // Reset all filters
  const clearAll = () => {
    setSearch("");
    setFilter("all");
    setSort("none");
  };

  // Filtering
  let filteredSellers = dummySellers.filter((seller) => {
    const matchesSearch = seller.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "top-rated" && seller.rating >= 4.8) ||
      (filter === "most-sales" && seller.sales >= 10000);

    return matchesSearch && matchesFilter;
  });

  // Sorting
  if (sort === "sales-high") {
    filteredSellers = [...filteredSellers].sort((a, b) => b.sales - a.sales);
  } else if (sort === "sales-low") {
    filteredSellers = [...filteredSellers].sort((a, b) => a.sales - b.sales);
  } else if (sort === "rating-high") {
    filteredSellers = [...filteredSellers].sort((a, b) => b.rating - a.rating);
  } else if (sort === "rating-low") {
    filteredSellers = [...filteredSellers].sort((a, b) => a.rating - b.rating);
  }

  return (
    <div className="top-seller-list-container">
      {/* Controls */}
      <div className="controls-wrapper">
        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search sellers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="control-input"
        />

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="control-select"
        >
          <option value="all">All Sellers</option>
          <option value="top-rated">Top Rated</option>
          <option value="most-sales">Most Sales</option>
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="control-select"
        >
          <option value="none">Sort By</option>
          <option value="sales-high">Sales: High → Low</option>
          <option value="sales-low">Sales: Low → High</option>
          <option value="rating-high">Rating: High → Low</option>
          <option value="rating-low">Rating: Low → High</option>
        </select>

        {/* Clear Button */}
        <button onClick={clearAll} className="clear-btn">
          Clear All ✖
        </button>
      </div>

      {/* Sellers Grid */}
      <div className="top-seller-list">
        {filteredSellers.length > 0 ? (
          filteredSellers.map((seller) => (
            <TopSellerCard key={seller.id} seller={seller} />
          ))
        ) : (
          <p className="no-results">No sellers match your search 🔍</p>
        )}
      </div>
    </div>
  );
};

export default TopSellerList;
