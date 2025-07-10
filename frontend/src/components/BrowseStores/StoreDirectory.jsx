import { useState, useEffect } from "react";
import StoreCard from "./StoreCard";
import "./Styles/StoreDirectory.css";

const StoreDirectory = () => {
  const [stores, setStores] = useState([]);
  const [location, setLocation] = useState("");
  const [storeType, setStoreType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStores = async () => {
    try {
      let url = "http://localhost:5000/api/shops";
      const queryParams = [];

      if (location) queryParams.push(`location=${encodeURIComponent(location)}`);
      if (storeType) queryParams.push(`store_type=${encodeURIComponent(storeType)}`);

      if (queryParams.length) url += `?${queryParams.join("&")}`;

      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        setStores(data.shops || []);
      } else {
        console.error("Failed to fetch shops:", data.message);
        setStores([]);
      }
    } catch (err) {
      console.error("Network error while fetching shops:", err);
      setStores([]);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [location, storeType]);

  // Filter by searchTerm on frontend
  const filteredStores = stores.filter((shop) => {
    const search = searchTerm.toLowerCase();
    return (
      shop.shop_name.toLowerCase().includes(search) ||
      shop.shop_handle?.toLowerCase().includes(search) ||
      shop.owner_name?.toLowerCase().includes(search) ||
      shop.store_type?.toLowerCase().includes(search) ||
      shop.location?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="store-directory">
      {/* 🔍 Filters + Search */}
      <div className="store-filters">
        <input
          type="text"
          placeholder="Search by name, owner, location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">All Locations</option>
          <option value="Lagos">Lagos</option>
          <option value="Abuja">Abuja</option>
          <option value="Port Harcourt">Port Harcourt</option>
          <option value="Kano">Kano</option>
        </select>

        <select value={storeType} onChange={(e) => setStoreType(e.target.value)}>
          <option value="">All Store Types</option>
          <option value="Fashion">Fashion</option>
          <option value="Electronics">Electronics</option>
          <option value="Home Decor">Home Decor</option>
        </select>
      </div>

      {/* 🏪 Store Cards */}
      <div className="store-grid">
        {filteredStores.length > 0 ? (
          filteredStores.map((shop) => <StoreCard key={shop.shop_id} shop={shop} />)
        ) : (
          <p>No stores match your search or filter.</p>
        )}
      </div>
    </div>
  );
};

export default StoreDirectory;
