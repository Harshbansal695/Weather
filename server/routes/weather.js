const express = require('express');
const axios = require('axios');
const router = express.Router();

// Current weather endpoint
router.get('/', async (req, res) => {
  try {
    const { city } = req.query;

    // Debug log
    console.log('Received request for city:', city);
    console.log('API Key:', process.env.OPENWEATHERMAP_API_KEY);

    // Validate city parameter
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    // Construct the API URL
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`;

    console.log('Making request to:', apiUrl);

    // Make request to OpenWeatherMap API
    const response = await axios.get(apiUrl);

    // Debug log
    console.log('Received response:', response.data);

    // Format the weather data
    const weatherData = {
      temperature: response.data.main.temp,
      condition: response.data.weather[0].main,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      city: response.data.name,
      country: response.data.sys.country,
    };

    // Send successful response
    res.json(weatherData);

  } catch (error) {
    // Detailed error logging
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    if (error.response) {
      if (error.response.status === 404) {
        return res.status(404).json({ error: 'City not found' });
      }
      if (error.response.status === 401) {
        return res.status(401).json({ error: 'Invalid API key' });
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      details: error.message
    });
  }
});

// 5-day forecast endpoint
router.get('/forecast', async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    // First, get coordinates from city name
    const geoResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${process.env.OPENWEATHERMAP_API_KEY}`
    );

    const { lat, lon } = geoResponse.data.coord;

    // Get 5-day forecast using coordinates
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`
    );

    // Process the forecast data to get daily forecasts
    const dailyForecasts = forecastResponse.data.list.reduce((acc, forecast) => {
      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = {
          dt: forecast.dt,
          temp: {
            min: forecast.main.temp_min,
            max: forecast.main.temp_max
          },
          weather: forecast.weather,
          humidity: forecast.main.humidity,
          wind_speed: forecast.wind.speed
        };
      }
      return acc;
    }, {});

    // Convert to array and take only first 5 days
    const fiveDayForecast = Object.values(dailyForecasts).slice(0, 5);

    res.json(fiveDayForecast);
  } catch (error) {
    console.error('Forecast API Error:', error.response?.data || error.message);
    
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'City not found' });
    }
    if (error.response && error.response.status === 401) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch forecast data',
      details: error.message 
    });
  }
});

module.exports = router;