import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Country, City } from 'country-state-city';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f0f0f0;
  overflow: hidden;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const SidebarRight = styled.div`
  width: 300px;
  background-color: #001f3f;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Dropdown = styled.select`
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #ccc;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const OverviewItem = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 220px;
  height: 150px;
  text-align: center;
  margin: 10px;
`;

const WeatherInfo = styled.div`
  background-color: #00264d;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  text-align: center;
  margin-top: 20px;
  color: white;
`;

const WeatherText = styled.p`
  font-size: 18px;
  margin-bottom: 10px;
`;

const WeatherTitle = styled.h1`
  font-size: 32px;
  color: #333;
`;

const Weather = () => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const API_KEY = '587956289889ba7eff14b48887c74d6e';  // Updated API key

  useEffect(() => {
    const countriesData = Country.getAllCountries();
    setCountries(countriesData);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const citiesData = City.getCitiesOfCountry(selectedCountry);
      setCities(citiesData);
    } else {
      setCities([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (selectedCity) {
        try {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${API_KEY}&units=metric`);
          setWeather(response.data);
          setError('');
          console.log(response.data);
        } catch (err) {
          if (err.response && err.response.status === 401) {
            setError('Invalid API key. Please check your API key.');
          } else {
            setError('City not found');
          }
          setWeather(null);
        }
      }
    };

    fetchWeather();
  }, [selectedCity]);

  const getWeatherIconUrl = (iconCode) => `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return (
    <Container>
      <MainContent>
        <div>
          <WeatherTitle>Weather Wise</WeatherTitle>
        </div>
        <Header>
          <Dropdown
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </Dropdown>
          <Dropdown
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedCountry}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </Dropdown>
        </Header>
        {error && <p>{error}</p>}
        <Overview>
          <OverviewItem>
            <h3>Wind Speed</h3>
            <p>{weather ? `${weather.wind.speed} m/s` : 'N/A'}</p>
            {weather && <img src={getWeatherIconUrl(weather.weather[0].icon)} alt="Weather icon" />}
          </OverviewItem>
          <OverviewItem>
            <h3>Sky</h3>
            <p>{weather ? `${weather.weather[0].description}` : 'N/A'}</p>
            {weather && <img src={getWeatherIconUrl(weather.weather[0].icon)} alt="Weather icon" />}
          </OverviewItem>
          <OverviewItem>
            <h3>Pressure</h3>
            <p>{weather ? `${weather.main.pressure} hPa` : 'N/A'}</p>
            {weather && <img src={getWeatherIconUrl(weather.weather[0].icon)} alt="Weather icon" />}
          </OverviewItem>
          <OverviewItem>
            <h3>Feel Like</h3>
            <p>{weather ? `${weather.main.feels_like} °C` : 'N/A'}</p>
            {weather && <img src={getWeatherIconUrl(weather.weather[0].icon)} alt="Weather icon" />}
          </OverviewItem>
        </Overview>
      </MainContent>
      <SidebarRight>
        {weather && (
          <>
            <h2>{weather.name}</h2>
            <p>{weather.main.temp}°C</p>
            <img src={getWeatherIconUrl(weather.weather[0].icon)} alt="Weather icon" />
            <WeatherInfo>
              <p style={{ marginBottom: '10px' }}>
                <FontAwesomeIcon icon={faSun} style={{ marginRight: '5px' }} />
                Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}
              </p>
              <p>
                <FontAwesomeIcon icon={faMoon} style={{ marginRight: '5px' }} />
                Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}
              </p>
            </WeatherInfo>
          </>
        )}
      </SidebarRight>
    </Container>
  );
};

export default Weather;
