import { useEffect, useState } from "react";
import axios from "axios";

const LocationPicker = ({ onChange }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedCountryName, setSelectedCountryName] = useState("");
  const [selectedStateCode, setSelectedStateCode] = useState(""); // NG-24 etc.
  const [selectedStateName, setSelectedStateName] = useState(""); // Lagos etc.
  const [selectedCity, setSelectedCity] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://countriesnow.space/api/v0.1/countries/positions");
        const data = await response.json();
        if (Array.isArray(data.data)) {
          setCountries(data.data);
        } else {
          setCountries([]);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
        setCountries([]);
      }
    };

    fetchCountries();
  }, []);

  // ✅ Fetch states when country changes
  useEffect(() => {
    if (!selectedCountryCode) {
      setStates([]);
      setSelectedStateCode("");
      setSelectedStateName("");
      return;
    }

    setLoading(true);
    axios
      .get(`/api/locations/states/${selectedCountryCode}`)
      .then((res) => {
        setStates(res.data);
        setSelectedStateCode("");
        setSelectedStateName("");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load states");
        setLoading(false);
      });
  }, [selectedCountryCode]);

  // ✅ Fetch cities when state changes
  useEffect(() => {
    if (!selectedStateCode) {
      setCities([]);
      setSelectedCity("");
      return;
    }

    setLoading(true);
    axios
      .get(`/api/locations/cities/${selectedStateCode}`)
      .then((res) => {
        setCities(res.data);
        setSelectedCity("");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load cities");
        setLoading(false);
      });
  }, [selectedStateCode]);

  // ✅ Notify parent
  useEffect(() => {
    if (selectedCountryName && selectedStateName && selectedCity) {
      onChange({
        country: selectedCountryName,
        state: selectedStateName, // send real state name instead of "NG-24"
        city: selectedCity,
      });
    }
  }, [selectedCountryName, selectedStateName, selectedCity, onChange]);

  if (loading) return <p>Loading locations...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      {/* Country Selector */}
      <select
        value={selectedCountryCode}
        onChange={(e) => {
          const code = e.target.value;
          const country = countries.find((c) => c.iso2 === code);
          setSelectedCountryCode(code);
          setSelectedCountryName(country?.name || "");
          setSelectedStateCode("");
          setSelectedStateName("");
          setSelectedCity("");
        }}
      >
        <option value="">Select a country</option>
        {countries.map((c) => (
          <option key={c.iso2} value={c.iso2}>
            {c.name}
          </option>
        ))}
      </select>

      {/* State Selector */}
      <select
        value={selectedStateCode}
        onChange={(e) => {
          const code = e.target.value;
          const state = states.find((s) => s.code === code);
          setSelectedStateCode(code); // NG-24 etc.
          setSelectedStateName(state?.name || ""); // Lagos etc.
          setSelectedCity("");
        }}
        required
        disabled={!states.length}
      >
        <option value="">Select State</option>
        {states.map((s) => (
          <option key={s.code} value={s.code}>
            {s.name}
          </option>
        ))}
      </select>

      {/* City Selector */}
      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        required
        disabled={!cities.length}
      >
        <option value="">Select City</option>
        {cities.map((city) => (
          <option key={city.id} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationPicker;
