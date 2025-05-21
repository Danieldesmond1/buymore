// RoleSelection.jsx
const RoleSelection = ({ setRole }) => {
  return (
    <div>
      <h3>Select Role</h3>
      <button onClick={() => setRole("buyer")}>Buyer</button>
      <button onClick={() => setRole("seller")}>Seller</button>
    </div>
  );
};

export default RoleSelection;
