import React, { useEffect, useState } from 'react';


function CountryCard({ name, flag, abbr }) {
    return (
        <div
            className="countryCard" // Add this line
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                border: "1px solid gray",
                borderRadius: "4px",
                height: "200px",
                width: "200px",
                textAlign: "center",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s ease-in-out",
            }}

            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
            <img
                src={flag}
                alt={`flag of ${abbr}`}
                style={{
                    height: "100px",
                    width: "100px",
                    objectFit: "contain",
                }}

                onError={(e) => {
                    e.target.onerror = null;

                    e.target.src = `https://placehold.co/100x100/E0E0E0/6C757D?text=No+Flag`;
                }}
            />
            <h2 style={{ fontSize: "1.2em", margin: "0" }}>{name}</h2>
        </div>
    );
}


const API_ENDPOINT = 'https://xcountries-backend.azurewebsites.net/all';


const Countries = () => {
    const [allCountries, setAllCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(API_ENDPOINT);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setAllCountries(data);
                setFilteredCountries(data);
            } catch (err) {

                setError(err.message);
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCountries();
    }, []);


    useEffect(() => {
        if (searchTerm === '') {

            setFilteredCountries(allCountries);
        } else {

            const lowerCaseSearchTerm = searchTerm.toLowerCase();

            const filtered = allCountries.filter(country =>
                country.name.toLowerCase().includes(lowerCaseSearchTerm)
            );
            setFilteredCountries(filtered);
        }
    }, [searchTerm, allCountries]);


    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
            minHeight: "100vh",
            backgroundColor: "#f0f2f5",
            fontFamily: "'Inter', sans-serif",
        }}>
            <div style={{
                width: "100%",
                maxWidth: "600px",
                marginBottom: "20px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                overflow: "hidden",
            }}>
                <input
                    type="text"
                    placeholder="Search for countries..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{
                        width: "100%",
                        padding: "12px 15px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        fontSize: "1.1em",
                        boxSizing: "border-box",
                    }}
                />
            </div>

            {loading && (
                <div style={{ fontSize: "1.5em", color: "#555", marginTop: "50px" }}>Loading countries...</div>
            )}

            {error && (
                <div style={{ fontSize: "1.5em", color: "red", marginTop: "50px" }}>Error: {error}. Please try again later.</div>
            )}


            {!loading && !error && filteredCountries.length === 0 && searchTerm !== '' && (
                <div style={{ fontSize: "1.5em", color: "#555", marginTop: "50px" }}>No countries found for "{searchTerm}".</div>
            )}

             {!loading && !error && filteredCountries.length === 0 && searchTerm === '' && (
                <div style={{ fontSize: "1.5em", color: "#555", marginTop: "50px" }}>No countries to show.</div>
            )}

            {!loading && !error && filteredCountries.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "20px",
                        width: "100%",
                        maxWidth: "1200px",
                    }}
                >

                    {filteredCountries.map((item) => (
                        <CountryCard
                            name={item.name}
                            flag={item.flag}
                            abbr={item.abbr}
                            key={item.abbr}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Countries;