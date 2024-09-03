import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchLocation, getCurrentWeather, getForecast, addToFavorites } from '../store/weatherSlice';
import { WiDaySunny, WiNightClear, WiRain, WiSnow, WiCloudy } from 'react-icons/wi';
import toast from 'react-hot-toast';
import TemperatureToggle from '../components/TemperatureToggle';
import '../styles/App.css';

const WeatherPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const { locations, currentWeather, forecast, temperatureUnit, status, error } = useSelector(state => state.weather);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a city name');
      return;
    }
    try {
      const resultAction = await dispatch(searchLocation(searchQuery));
      if (searchLocation.fulfilled.match(resultAction)) {
        const locationKey = resultAction.payload[0]?.Key;
        if (locationKey) {
          dispatch(getCurrentWeather(locationKey));
          dispatch(getForecast(locationKey));
          toast.success('Weather data loaded successfully');
        } else {
          toast.error('No location found');
        }
      }
    } catch (error) {
      toast.error('Error fetching weather data');
    }
  };

  const handleAddToFavorites = () => {
    if (currentWeather && locations[0]) {
      dispatch(addToFavorites({
        id: locations[0].Key,
        name: locations[0].LocalizedName,
        currentWeather: currentWeather
      }));
      toast.success('Added to favorites');
    }
  };

  const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
      case 1: return <WiDaySunny />;
      case 33: return <WiNightClear />;
      case 12: return <WiRain />;
      case 22: return <WiSnow />;
      default: return <WiCloudy />;
    }
  };

  const convertTemperature = (celsius) => {
    if (temperatureUnit === 'C') return celsius;
    return Math.round((celsius * 9/5) + 32);
  };

  return (
    <div className="weather-container">
      <h1>Weather Search</h1>
      <div className="search-container">
        <input 
          type="text" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter city name"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <TemperatureToggle />

      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}

      {currentWeather && (
        <div className="current-weather">
          <h2>{locations[0]?.LocalizedName}</h2>
          <div className="weather-icon">{getWeatherIcon(currentWeather.WeatherIcon)}</div>
          <p className="weather-text">{currentWeather.WeatherText}</p>
          <p className="temperature">{convertTemperature(currentWeather.Temperature.Metric.Value)}°{temperatureUnit}</p>
          <button onClick={handleAddToFavorites}>Add to Favorites</button>
        </div>
      )}

      {forecast && (
        <div className="forecast">
          <h2>5-Day Forecast</h2>
          <div className="forecast-grid">
            {forecast.DailyForecasts.map((day, index) => (
              <div key={index} className="forecast-item">
                <p className="date">{new Date(day.Date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                <div className="weather-icon">{getWeatherIcon(day.Day.Icon)}</div>
                <p className="day-night">
                  Day: {day.Day.IconPhrase}<br />
                  Night: {day.Night.IconPhrase}
                </p>
                <p className="temperature">
                  Max: {convertTemperature(day.Temperature.Maximum.Value)}°{temperatureUnit}<br />
                  Min: {convertTemperature(day.Temperature.Minimum.Value)}°{temperatureUnit}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherPage;