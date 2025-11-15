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

  // ✅ Dynamic API base URL (works on local + live)
  const BASE_URL =
    import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(`${BASE_URL}/api/shops`);

        const shops = data.shops || [];

        // ✅ Format images for live/local
        const processed = shops.map((s) => {
          let logo = s.logo_image;
          let banner = s.banner_image;

          // Logo
          if (logo) {
            // Ensure it starts with a slash
            if (logo) {
            if (!logo.startsWith("http")) {
              logo = `/uploads/${logo.replace(/^\/+/, "")}`;
              logo = `${BASE_URL}${logo}`;
            }
          }

          } else {
            logo = "https://via.placeholder.com/80x80.png?text=No+Logo";
          }

          // Banner
          if (banner) {
            if (!banner.startsWith("http")) {
              banner = `/uploads/${banner.replace(/^\/+/, "")}`;
              banner = `${BASE_URL}${banner}`;
            }
          }  else {
            banner = "https://via.placeholder.com/600x200.png?text=No+Banner";
          }
          return {
            id: s.shop_id,
            name: s.shop_name,
            logo,
            banner,
            rating: s.rating || 0,
            sales: s.sales || 0,
            location: s.location,
            badge: s.store_type,
          };
        });

        setSellers(processed);
      } catch (err) {
        console.error("Error fetching shops:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [BASE_URL]);

  // Reset filters
  const clearAll = () => {
    setSearch("");
    setFilter("all");
    setSort("none");
  };

  // Filtering
  let filteredSellers = sellers.filter((seller) => {
    const matchesSearch = seller.name
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
    filteredSellers = [...filteredSellers].sort(
      (a, b) => (b.sales || 0) - (a.sales || 0)
    );
  } else if (sort === "sales-low") {
    filteredSellers = [...filteredSellers].sort(
      (a, b) => (a.sales || 0) - (b.sales || 0)
    );
  } else if (sort === "rating-high") {
    filteredSellers = [...filteredSellers].sort(
      (a, b) => (b.rating || 0) - (a.rating || 0)
    );
  } else if (sort === "rating-low") {
    filteredSellers = [...filteredSellers].sort(
      (a, b) => (a.rating || 0) - (b.rating || 0)
    );
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

        {/* Clear */}
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
              <TopSellerCard key={seller.id} seller={seller} />
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
