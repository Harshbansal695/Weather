import React from 'react';

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  return (
    <div className="weather-card">
      <h2>{weather.city}, {weather.country}</h2>
      <img
        src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
        alt={weather.description}
      />
      <div className="temperature">{Math.round(weather.temperature)}°C</div>
      <div className="condition">{weather.condition}</div>
      <div className="details">
        <div>Humidity: {weather.humidity}%</div>
        <div>Wind Speed: {weather.windSpeed} m/s</div>
      </div>
    </div>
  );
};

export default WeatherCard;
