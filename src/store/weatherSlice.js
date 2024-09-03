import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = 'Or4mRc3KuvB2dmAzhxETD1vGhkPz7HCG';
const BASE_URL = 'http://dataservice.accuweather.com';

export const searchLocation = createAsyncThunk(
  'weather/searchLocation',
  async (query) => {
    const response = await axios.get(`${BASE_URL}/locations/v1/cities/autocomplete`, {
      params: { apikey: API_KEY, q: query }
    });
    return response.data;
  }
);

export const getCurrentWeather = createAsyncThunk(
  'weather/getCurrentWeather',
  async (locationKey) => {
    const response = await axios.get(`${BASE_URL}/currentconditions/v1/${locationKey}`, {
      params: { apikey: API_KEY }
    });
    return response.data[0];
  }
);

export const getForecast = createAsyncThunk(
  'weather/getForecast',
  async (locationKey) => {
    const response = await axios.get(`${BASE_URL}/forecasts/v1/daily/5day/${locationKey}`, {
      params: { apikey: API_KEY }
    });
    return response.data;
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    locations: [],
    currentWeather: null,
    forecast: null,
    favorites: [],
    temperatureUnit: 'C',
    status: 'idle',
    error: null,
  },
  reducers: {
    addToFavorites: (state, action) => {
      state.favorites.push(action.payload);
    },
    removeFromFavorites: (state, action) => {
      state.favorites = state.favorites.filter(fav => fav.id !== action.payload);
    },
    toggleTemperatureUnit: (state) => {
      state.temperatureUnit = state.temperatureUnit === 'C' ? 'F' : 'C';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchLocation.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchLocation.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.locations = action.payload;
      })
      .addCase(searchLocation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(getCurrentWeather.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCurrentWeather.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentWeather = action.payload;
      })
      .addCase(getCurrentWeather.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(getForecast.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getForecast.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.forecast = action.payload;
      })
      .addCase(getForecast.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addToFavorites, removeFromFavorites, toggleTemperatureUnit } = weatherSlice.actions;

export default weatherSlice.reducer;