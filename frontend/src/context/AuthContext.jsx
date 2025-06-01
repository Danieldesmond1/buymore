import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          credentials: "include",
        });

        if (res.ok) {
          const user = await res.json();
          setUser(user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching current user:", err);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const login = (userData) => setUser(userData);

  const logout = async () => {
    try {
      await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
