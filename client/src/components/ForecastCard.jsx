import React from 'react';

const ForecastCard = ({ forecast }) => {
  if (!forecast) return null;

  // Helper function to format date
  const formatDate = (dt) => {
    const date = new Date(dt * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="forecast-container">
      <h2>5-Day Forecast</h2>
      <div className="forecast-cards">
        {forecast.map((day, index) => (
          <div key={index} className="forecast-day-card">
            <div className="forecast-date">{formatDate(day.dt)}</div>
            <img
              src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              alt={day.weather[0].description}
            />
            <div className="forecast-temp">
              <span className="max">{Math.round(day.temp.max)}°C</span>
              <span className="min">{Math.round(day.temp.min)}°C</span>
            </div>
            <div className="forecast-description">{day.weather[0].main}</div>
            <div className="forecast-details">
              <div>Humidity: {day.humidity}%</div>
              <div>Wind: {day.wind_speed} m/s</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastCard;
