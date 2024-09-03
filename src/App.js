import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import WeatherPage from './pages/WeatherPage';
import FavoritesPage from './pages/FavoritesPage';
import { Toaster } from 'react-hot-toast';
import './styles/App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app-container">
          <nav>
            <ul>
              <li>
                <Link to="/">Weather</Link>
              </li>
              <li>
                <Link to="/favorites">Favorites</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<WeatherPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </div>
      </Router>
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
        },
      }} />
    </Provider>
  );
}

export default App;