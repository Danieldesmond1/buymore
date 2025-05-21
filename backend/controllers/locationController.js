import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ✅ Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Use the correct path to your JSON file
const filePath = path.join(__dirname, '../data/countries+states+cities.json');

// Load the JSON data once
let locationData = null;
fs.readFile(filePath, 'utf8', (err, data) => {
  if (!err) {
    locationData = JSON.parse(data);
    console.log('Location data loaded');
  } else {
    console.error('Failed to read location data:', err);
  }
});

// ✅ Get all countries
export const getCountries = (req, res) => {
  if (!locationData) return res.status(500).json({ message: 'Location data not loaded' });
  res.json(locationData.map(({ name, iso2, iso3 }) => ({ name, iso2, iso3 })));
};

// ✅ Get states by country code (e.g. "NG" or "NGA")
export const getStates = (req, res) => {
  const { countryCode } = req.params;
  if (!locationData) return res.status(500).json({ message: 'Location data not loaded' });

  const country = locationData.find(c => c.iso2 === countryCode || c.iso3 === countryCode);
  if (!country) return res.status(404).json({ message: 'Country not found' });

  const formattedStates = (country.states || []).map((state, index) => ({
    name: state.name,
    code: `${country.iso2}-${index}`
  }));

  res.json(formattedStates);
};

// ✅ Get cities by custom stateCode ("NG-1", etc.)
export const getCities = (req, res) => {
  const { stateCode } = req.params;
  if (!locationData) return res.status(500).json({ message: 'Location data not loaded' });

  const [countryCode, stateIndex] = stateCode.split("-");
  const country = locationData.find(c => c.iso2 === countryCode || c.iso3 === countryCode);
  if (!country) return res.status(404).json({ message: 'Country not found' });

  const state = (country.states || [])[parseInt(stateIndex)];
  if (!state) return res.status(404).json({ message: 'State not found' });

  const formattedCities = (state.cities || []).map((city, id) => ({
    id: city.id || id,
    name: city.name,
    latitude: city.latitude,
    longitude: city.longitude
  }));

  res.json(formattedCities);
};
