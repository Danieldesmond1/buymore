import { createContext, useContext, useState, useEffect } from "react";

const PageLoaderContext = createContext();

export const PageLoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [homeLoaded, setHomeLoaded] = useState(false);

  // failsafe timeout
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 7000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <PageLoaderContext.Provider value={{ loading, setLoading, homeLoaded, setHomeLoaded }}>
      {children}
    </PageLoaderContext.Provider>
  );
};

export const usePageLoader = () => useContext(PageLoaderContext);
