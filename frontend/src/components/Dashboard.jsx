import React, { useEffect, useState, useRef } from 'react'
import citiesData from '../cities.json'
import search_icon from '../assets/search.png'
import './Dashboard.css'

const Dashboard = ({ onCitySelect }) => {
    const inputRef = useRef()
    const [weatherCards, setWeatherCards] = useState([])
    const [loading, setLoading] = useState(true)
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)

    // Main cities to display on dashboard
    const mainCities = [
        { name: "Colombo", code: "1248991", color: "blue" },
        { name: "Tokyo", code: "1850147", color: "purple" },
        { name: "Liverpool", code: "2644210", color: "green" },
        { name: "Sydney", code: "2147714", color: "orange" },
        { name: "Boston", code: "4930956", color: "red" },
        { name: "Paris", code: "2988507", color: "teal" }
    ]

    const allIcons = {
        "01d": "https://openweathermap.org/img/wn/01d@2x.png",
        "01n": "https://openweathermap.org/img/wn/01n@2x.png",
        "02d": "https://openweathermap.org/img/wn/02d@2x.png",
        "02n": "https://openweathermap.org/img/wn/02n@2x.png",
        "03d": "https://openweathermap.org/img/wn/03d@2x.png",
        "03n": "https://openweathermap.org/img/wn/03n@2x.png",
        "04d": "https://openweathermap.org/img/wn/04d@2x.png",
        "04n": "https://openweathermap.org/img/wn/04n@2x.png",
        "09d": "https://openweathermap.org/img/wn/09d@2x.png",
        "09n": "https://openweathermap.org/img/wn/09n@2x.png",
        "10d": "https://openweathermap.org/img/wn/10d@2x.png",
        "10n": "https://openweathermap.org/img/wn/10n@2x.png",
        "11d": "https://openweathermap.org/img/wn/11d@2x.png",
        "11n": "https://openweathermap.org/img/wn/11n@2x.png",
        "13d": "https://openweathermap.org/img/wn/13d@2x.png",
        "13n": "https://openweathermap.org/img/wn/13n@2x.png",
        "50d": "https://openweathermap.org/img/wn/50d@2x.png",
        "50n": "https://openweathermap.org/img/wn/50n@2x.png",
    }

    // Function to find city code by city name
    const findCityCode = (cityName) => {
        const city = citiesData.List.find(
            city => city.CityName.toLowerCase() === cityName.toLowerCase()
        );
        return city ? city.CityCode : null;
    };

    // Function to get city suggestions
    const getCitySuggestions = (input) => {
        if (!input || input.length < 2) return [];
        return citiesData.List.filter(city =>
            city.CityName.toLowerCase().includes(input.toLowerCase())
        ).slice(0, 5);
    };

    // Handle input change for suggestions
    const handleInputChange = (value) => {
        const suggestions = getCitySuggestions(value);
        setSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0 && value.length > 1);
    };

    // Handle suggestion selection
    const handleSuggestionClick = (cityName, cityCode) => {
        inputRef.current.value = cityName;
        setShowSuggestions(false);
        searchCity(cityCode);
    };

    const searchCity = async (cityInput) => {
        let apiUrl;

        // If cityInput is not a number, it's a city name - find the code
        if (isNaN(cityInput)) {
            const inputValue = cityInput || inputRef.current.value;
            if (inputValue === "") {
                alert("Please enter a city name");
                return;
            };
            
            const cityCode = findCityCode(inputValue);
            if (cityCode) {
                // Use city ID for more accurate results
                apiUrl = `https://api.openweathermap.org/data/2.5/weather?id=${cityCode}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            } else {
                // Fallback to city name search
                apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            }
        } else {
            // Use city ID directly
            apiUrl = `https://api.openweathermap.org/data/2.5/weather?id=${cityInput}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
        }

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!response.ok) {
                alert(data.message || 'Weather data not found');
                return;
            }
            
            const icon = allIcons[data.weather[0].icon];
            const cityData = {
                id: data.id,
                name: data.name,
                country: data.sys.country,
                temperature: Math.round(data.main.temp),
                tempMin: Math.round(data.main.temp_min),
                tempMax: Math.round(data.main.temp_max),
                description: data.weather[0].main,
                icon: icon,
                pressure: data.main.pressure,
                humidity: data.main.humidity,
                visibility: data.visibility ? Math.round(data.visibility / 1000) : 0,
                windSpeed: Math.round(data.wind.speed),
                windDegree: data.wind.deg || 0,
                sunrise: data.sys.sunrise,
                sunset: data.sys.sunset,
                color: 'blue'
            };

            // Navigate to detail view with searched city data
            onCitySelect(cityData, 'detail');
            
        } catch (error) {
            console.error("Error fetching weather data:", error);
            alert("Failed to fetch weather data. Please try again.");
        }
    };

    const handleSearch = () => {
        if (inputRef.current.value.trim()) {
            searchCity(inputRef.current.value.trim());
            setShowSuggestions(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const fetchCityWeather = async (cityCode, cityName, color) => {
        try {
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?id=${cityCode}&units=metric&appid=${import.meta.env.VITE_APP_ID}`
            const response = await fetch(apiUrl)
            const data = await response.json()

            if (response.ok) {
                const icon = allIcons[data.weather[0].icon]
                return {
                    id: cityCode,
                    name: cityName,
                    country: data.sys.country,
                    temperature: Math.round(data.main.temp),
                    tempMin: Math.round(data.main.temp_min),
                    tempMax: Math.round(data.main.temp_max),
                    description: data.weather[0].main,
                    icon: icon,
                    pressure: data.main.pressure,
                    humidity: data.main.humidity,
                    visibility: data.visibility ? Math.round(data.visibility / 1000) : 0,
                    windSpeed: Math.round(data.wind.speed),
                    windDegree: data.wind.deg || 0,
                    sunrise: data.sys.sunrise,
                    sunset: data.sys.sunset,
                    color: color
                }
            }
        } catch (error) {
            console.error(`Error fetching weather for ${cityName}:`, error)
        }
        return null
    }

    const loadDashboardData = async () => {
        setLoading(true)
        const weatherPromises = mainCities.map(city => 
            fetchCityWeather(city.code, city.name, city.color)
        )
        
        const results = await Promise.all(weatherPromises)
        const validResults = results.filter(result => result !== null)
        setWeatherCards(validResults)
        setLoading(false)
    }

    useEffect(() => {
        loadDashboardData()
    }, [])

    const handleAddCity = () => {
        // This would typically open a modal or navigate to add city page
        onCitySelect(null, 'search')
    }

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading weather data...</p>
            </div>
        )
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="header-left">
                    <div className="weather-icon">☀️</div>
                    <h1>Weather App</h1>
                </div>
                <div className="header-actions">
                    <button className="clear-btn">Clear a city</button>
                    <button className="add-btn" onClick={handleAddCity}>Add City</button>
                </div>
            </div>

            {/* Search bar */}
            <div className="dashboard-search">
                <div className='search-bar'>
                    <input 
                        ref={inputRef} 
                        type="text" 
                        placeholder='Search for a city' 
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />    
                    <img src={search_icon} alt="search" onClick={handleSearch} />
                    
                    {/* Suggestions dropdown */}
                    {showSuggestions && (
                        <div className='suggestions-dropdown'>
                            {suggestions.map((city) => (
                                <div 
                                    key={city.CityCode} 
                                    className='suggestion-item'
                                    onClick={() => handleSuggestionClick(city.CityName, city.CityCode)}
                                >
                                    {city.CityName}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="weather-grid">
                {weatherCards.map((card) => (
                    <div 
                        key={card.id} 
                        className={`weather-card ${card.color}`}
                        onClick={() => onCitySelect(card, 'detail')}
                    >
                        <div className="card-header">
                            <div className="city-info">
                                <h2>{card.name}, {card.country}</h2>
                                <p className="card-time">
                                    {new Date().toLocaleTimeString('en-US', { 
                                        hour: 'numeric', 
                                        minute: '2-digit',
                                        hour12: true 
                                    })}
                                </p>
                            </div>
                            <button className="close-btn">×</button>
                        </div>

                        <div className="card-main">
                            <div className="temp-section">
                                <span className="main-temp">{card.temperature}°C</span>
                            </div>
                            <div className="weather-info">
                                <img src={card.icon} alt={card.description} className="weather-icon-small" />
                                <span className="weather-desc">{card.description}</span>
                            </div>
                        </div>

                        <div className="temp-range">
                            <span>Temp Min: {card.tempMin}°C</span>
                            <span>Temp Max: {card.tempMax}°C</span>
                        </div>

                        <div className="card-details">
                            <div className="detail-row">
                                <span>Pressure: {card.pressure}hPa</span>
                                <span>Sunrise: {formatTime(card.sunrise)}</span>
                            </div>
                            <div className="detail-row">
                                <span>Humidity: {card.humidity}%</span>
                                <span>Sunset: {formatTime(card.sunset)}</span>
                            </div>
                            <div className="detail-row">
                                <span>Visibility: {card.visibility}.0km</span>
                            </div>
                            <div className="wind-row">
                                <span>🌬️ {card.windSpeed} m/s {card.windDegree}° Degree</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-footer">
                <p>2023 Robert Technologies</p>
            </div>
        </div>
    )
}

export default Dashboard;
