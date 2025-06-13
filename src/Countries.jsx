import React, { useEffect, useState } from "react";
import axios from "axios";


function CountryCard({ name, flag }) {
  return (
    <div
      className="countryCard"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        width: "200px",
        height: "200px",
      }}
    >
      {flag ? (
        <img
          src={flag}
          alt={name}
          style={{
            width: "100px",
            height: "100px",
                        
          }}
          onError={(e) => {
            e.target.style.display = "none"; // Hide broken image
            console.warn("Flag failed to load for:", name);
          }}
        />
      ) : (
        <span style={{ fontSize: "12px", color: "gray" }}>No flag</span>
      )}
      <b>{name}</b>
    </div>
  );
}

const Countries = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  
  useEffect(() => {
  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        "https://countries-search-data-prod-812920491762.asia-south1.run.app/countries"
      );
      console.log("Fetched countries:", response.data);

      const validData = response.data
        .filter((country) => country.common && country.png)
        .map((country) => ({
          name: country.common,
          flag: country.png,
        }));

      console.log("Valid countries after filtering:", validData.length);
      setAllCountries(validData);
      setFilteredCountries(validData);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };
  fetchCountries();
}, []);

 
  useEffect(() => {
    const filtered = allCountries.filter(
      (country) =>
        country.name &&
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchTerm, allCountries]);

  return (
    <div>
      {/* Search Bar */}
      <div style={{ textAlign: "center", padding: "20px" }}>
        <input
          type="text"
          placeholder="Search for countries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            width: "60%",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>

      {/* Country Cards */}
      <div
        style={{
          display:"flex",
        flexWrap:"wrap",
        alignItems: "center",
        gap:" 10px",
        }}
      >
        {filteredCountries.length === 0 ? (
          <p>No countries to display</p>
        ) : (
          filteredCountries.map((country, index) => (
            <CountryCard
              key={index}
              name={country.name}
              flag={country.flag}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Countries;
