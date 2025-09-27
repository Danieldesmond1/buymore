import { useState, useEffect } from "react";
import axios from "axios";
import TopSellerCard from "./TopSellerCard";
import "./styles/TopSellerList.css";

const TopSellerList = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("none");

  // Fetch sellers from backend
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("http://localhost:5000/api/shops");
        // We get { shops: [...] } from backend, so we take data.shops
        setSellers(data.shops || []);
      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  // Reset filters
  const clearAll = () => {
    setSearch("");
    setFilter("all");
    setSort("none");
  };

  // Filtering
  let filteredSellers = sellers.filter((seller) => {
    const matchesSearch = seller.shop_name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "top-rated" && seller.rating >= 4.8) ||
      (filter === "most-sales" && seller.sales >= 10000);

    return matchesSearch && matchesFilter;
  });

  // Sorting
  if (sort === "sales-high") {
    filteredSellers = [...filteredSellers].sort((a, b) => (b.sales || 0) - (a.sales || 0));
  } else if (sort === "sales-low") {
    filteredSellers = [...filteredSellers].sort((a, b) => (a.sales || 0) - (b.sales || 0));
  } else if (sort === "rating-high") {
    filteredSellers = [...filteredSellers].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sort === "rating-low") {
    filteredSellers = [...filteredSellers].sort((a, b) => (a.rating || 0) - (b.rating || 0));
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
      {loading ? (
        <p className="loading-text">Loading sellers...</p>
      ) : (
        <div className="top-seller-list">
          {filteredSellers.length > 0 ? (
            filteredSellers.map((seller) => (
              <TopSellerCard
                key={seller.shop_id}
                seller={{
                  id: seller.shop_id,
                  name: seller.shop_name,
                  logo: seller.logo_image || "https://via.placeholder.com/80x80.png?text=No+Logo",
                  banner: seller.banner_image || "https://via.placeholder.com/600x200.png?text=No+Banner",
                  rating: seller.rating || 0, // Placeholder until shop ratings are implemented
                  sales: seller.sales || 0,   // Placeholder until sales tracking works
                  location: seller.location,
                  badge: seller.store_type, // Use store_type as a badge for now
                }}
              />
            ))
          ) : (
            <p className="no-results">No sellers match your search 🔍</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TopSellerList;
