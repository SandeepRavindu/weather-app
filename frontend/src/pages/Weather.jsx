import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import SearchBar from '../components/SearchBar'
import WeatherDetails from '../components/WeatherDetails'
import LoadingSpinner from '../components/LoadingSpinner'
import useWeatherOperations from '../hooks/useWeatherOperations'
import '../components/Weather.css'

const Weather = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const inputRef = useRef()
    const [weatherData, setWeatherData] = useState(false)
    const { getAccessTokenSilently } = useAuth0();
    
    const {
        suggestions,
        showSuggestions,
        handleInputChange,
        fetchWeatherData,
        formatTime,
        clearSuggestions
    } = useWeatherOperations()

    // Get city data passed from Dashboard page
    const selectedCity = location.state?.cityData

    // Function to format current date and time
    const getCurrentDateTime = () => {
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        const date = now.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
        return `${time}, ${date}`;
    };

    const handleSearch = async () => {
        if (!inputRef.current.value.trim()) {
            alert("Please enter a city name");
            return;
        }

        try {
            const token = await getAccessTokenSilently({
                audience: 'this is a unique identifier',
                scope: 'openid profile email'
            });
            const data = await fetchWeatherData(inputRef.current.value.trim(), token);
            setWeatherData(data);
            clearSuggestions();
        } catch (error) {
            alert("Failed to fetch weather data. Please try again.");
            // console.error('Search error:', error); // DEVELOPMENT: Commented for production
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }

    const handleSuggestionClick = async (cityName, cityCode) => {
        inputRef.current.value = cityName;
        clearSuggestions();
        
        try {
            const token = await getAccessTokenSilently({
                audience: 'this is a unique identifier',
                scope: 'openid profile email'
            });
            const data = await fetchWeatherData(cityCode, token);
            setWeatherData(data);
        } catch (error) {
            alert("Failed to fetch weather data. Please try again.");
            // console.error('Suggestion click error:', error); // DEVELOPMENT: Commented for production
        }
    };

    const handleBackToDashboard = () => {
        navigate('/')
    }

    useEffect(() => {
        const loadWeatherData = async () => {
            if (selectedCity) {
                // If a city is pre-selected from dashboard, use that data
                setWeatherData(selectedCity);
            } else {
                // Load default city (Colombo) if no city selected
                try {
                    const token = await getAccessTokenSilently({
                        audience: 'this is a unique identifier',
                        scope: 'openid profile email'
                    });
                    const data = await fetchWeatherData("1248991", token);
                    setWeatherData(data);
                } catch (error) {
                    // console.error("Error loading default city:", error); // DEVELOPMENT: Commented for production
                }
            }
        };

        loadWeatherData();
    }, [selectedCity])

    if (!weatherData) {
        return <LoadingSpinner message="Loading weather data..." />
    }

    return (
        <div className="weather-page">
            {/* Header with app title */}
            <div className='weather-app-header'>
                <div className="app-title-section">
                    <span className="weather-emoji">☀️</span>
                    <h1>Weather App</h1>
                </div>
            </div>

            {/* Single horizontal weather card matching the image design */}
            <div className="weather-card-container">
                <div className="horizontal-weather-card">
                    {/* Blue main section */}
                    <div className="weather-main-section">
                        <button className='back-btn-card' onClick={handleBackToDashboard}>
                            ←
                        </button>
                        <div className="city-header">
                            <h2 className="city-title">{weatherData.location || weatherData.name}, {weatherData.country}</h2>
                            <p className="time-stamp">{getCurrentDateTime()}</p>
                        </div>
                        
                        <div className="main-weather-display">
                            <div className="weather-icon-section">
                                <img src={weatherData.icon} alt={weatherData.description} className='weather-icon-main' />
                                <div className='weather-condition'>{weatherData.description}</div>
                            </div>
                            <div className="temperature-section">
                                <div className='main-temperature'>{weatherData.temperature}°C</div>
                                <div className='temp-min-max'>Temp Min: {weatherData.tempMin}°C</div>
                                <div className='temp-min-max'>Temp Max: {weatherData.tempMax}°C</div>
                            </div>
                        </div>
                    </div>

                    {/* Dark details section */}
                    <div className="weather-details-section">
                        <div className="details-grid">
                            <div className="detail-group">
                                <div className="detail-item">
                                    <span className="detail-label">Pressure:</span>
                                    <span className="detail-value">{weatherData.pressure}hPa</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Humidity:</span>
                                    <span className="detail-value">{weatherData.humidity}%</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Visibility:</span>
                                    <span className="detail-value">{weatherData.visibility}.0km</span>
                                </div>
                            </div>
                            
                            <div className="wind-section">
                                <div className="wind-icon">🌬️</div>
                                <div className="wind-text">{weatherData.windSpeed} m/s {weatherData.windDegree || 0}° Degree</div>
                            </div>
                            
                            <div className="sun-times">
                                <div className="sun-time-item">
                                    <span className="sun-label">Sunrise:</span>
                                    <span className="sun-value">{formatTime(weatherData.sunrise)}</span>
                                </div>
                                <div className="sun-time-item">
                                    <span className="sun-label">Sunset:</span>
                                    <span className="sun-value">{formatTime(weatherData.sunset)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="weather-footer">
                <p>2025 Ravindu Technologies</p>
            </div>
        </div>
    )
}

export default Weather