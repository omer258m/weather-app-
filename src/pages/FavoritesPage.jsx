import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromFavorites, getCurrentWeather } from '../store/weatherSlice';
import { useNavigate } from 'react-router-dom';
import { WiDaySunny, WiNightClear, WiRain, WiSnow, WiCloudy } from 'react-icons/wi';
import toast from 'react-hot-toast';
import '../styles/App.css';

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { favorites, temperatureUnit } = useSelector(state => state.weather);

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

  const handleRemoveFavorite = (id) => {
    dispatch(removeFromFavorites(id));
    toast.success('Location removed from favorites');
  };

  const handleFavoriteClick = async (locationKey) => {
    try {
      await dispatch(getCurrentWeather(locationKey));
      navigate('/');
    } catch (error) {
      toast.error('Error fetching weather data');
    }
  };

  return (
    <div className="favorites-container">
      <h1>Favorite Locations</h1>
      {favorites.length === 0 ? (
        <p>You haven't added any favorite locations yet.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map(favorite => (
            <div key={favorite.id} className="favorite-item" onClick={() => handleFavoriteClick(favorite.id)}>
              <h2>{favorite.name}</h2>
              {favorite.currentWeather && (
                <>
                  <div className="weather-icon">{getWeatherIcon(favorite.currentWeather.WeatherIcon)}</div>
                  <p className="weather-text">{favorite.currentWeather.WeatherText}</p>
                  <p className="temperature">
                    {convertTemperature(favorite.currentWeather.Temperature.Metric.Value)}°{temperatureUnit}
                  </p>
                </>
              )}
              <button onClick={(e) => {
                e.stopPropagation();
                handleRemoveFavorite(favorite.id);
              }}>Remove from Favorites</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;