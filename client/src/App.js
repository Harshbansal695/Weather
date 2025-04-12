import React, { useState } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import "./App.css";

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const weatherResponse = await axios.get(
        `http://localhost:5000/weather?city=${city}`
      );
      setWeather(weatherResponse.data);

      const forecastResponse = await axios.get(
        `http://localhost:5000/weather/forecast?city=${city}`
      );
      setForecast(forecastResponse.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch weather data");
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Weather Dashboard</h1>
      <SearchBar onSearch={handleSearch} />
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {weather && <WeatherCard weather={weather} />}
      {forecast && <ForecastCard forecast={forecast} />}
    </div>
  );
}

export default App;
