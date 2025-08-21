import TopSellerList from '../components/TopSellers/TopSellerList.jsx';

const TopSellers = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div
          className="py-6 px-6 mb-6 rounded-2xl shadow-sm"
          style={{
            background: "var(--card-bg)",
            color: "var(--text)",
            border: "1px solid var(--border-color)",
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
            marginTop: "20px",
            marginBottom: "20px",
            fontFamily: "var(--font-family)",
            fontSize: "1.2rem",
          }}
        >
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-color)" }}>
            Top Sellers
          </h1>
          <p className="mt-2 text-base" style={{ color: "var(--dropdown-text)" }}>
            Discover the best performing stores with the highest sales & ratings.
          </p>
        </div>

      {/* Seller List */}
      <div className="px-6 pb-10">
        <TopSellerList />
      </div>
    </div>
  );
};

export default TopSellers;
// This page displays a list of top sellers with their details and links to their stores.
// It uses the TopSellerList component to render the list of sellers.
