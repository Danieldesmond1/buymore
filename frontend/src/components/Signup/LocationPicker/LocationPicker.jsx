import { useEffect, useState } from "react";
import { LuMapPinHouse, LuFlag, LuLandmark  } from "react-icons/lu";
import axios from "axios";
import "../Styles/LocationPicker.css";

const LocationPicker = ({ onChange }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedCountryName, setSelectedCountryName] = useState("");
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [selectedStateName, setSelectedStateName] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/positions");
        const data = await res.json();
        if (Array.isArray(data.data)) {
          setCountries(data.data);
        } else {
          setCountries([]);
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
        setCountries([]);
      }
    };
    fetchCountries();
  }, []);

  // Fetch states
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

  // Fetch cities
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

  // Notify parent
  useEffect(() => {
    if (selectedCountryName && selectedStateName && selectedCity) {
      onChange({
        country: selectedCountryName,
        state: selectedStateName,
        city: selectedCity,
      });
    }
  }, [selectedCountryName, selectedStateName, selectedCity, onChange]);

  if (loading) return <p className="loading-text">Loading locations...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="location-picker">
      {/* Country */}
      <div className="input-wrapper">
        <LuFlag className="input-icon" />
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
          <option value="" disabled>Select Country</option>
          {countries.map((c) => (
            <option key={c.iso2} value={c.iso2}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* State */}
      <div className="input-wrapper">
        <LuLandmark className="input-icon" />
        <select
          value={selectedStateCode}
          onChange={(e) => {
            const code = e.target.value;
            const state = states.find((s) => s.code === code);
            setSelectedStateCode(code);
            setSelectedStateName(state?.name || "");
            setSelectedCity("");
          }}
          disabled={!states.length}
        >
          <option value="" disabled>Select State</option>
          {states.map((s) => (
            <option key={s.code} value={s.code}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div className="input-wrapper">
        <LuMapPinHouse className="input-icon" />
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!cities.length}
        >
          <option value="" disabled>Select City</option>
          {cities.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LocationPicker;
