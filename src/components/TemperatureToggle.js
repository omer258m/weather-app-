import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTemperatureUnit } from '../store/weatherSlice';

const TemperatureToggle = () => {
  const dispatch = useDispatch();
  const temperatureUnit = useSelector(state => state.weather.temperatureUnit);

  return (
    <button onClick={() => dispatch(toggleTemperatureUnit())}>
      Switch to °{temperatureUnit === 'C' ? 'F' : 'C'}
    </button>
  );
};

export default TemperatureToggle