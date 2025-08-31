import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import SearchBar from '../components/SearchBar'
import WeatherCard from '../components/WeatherCard'
import LoadingSpinner from '../components/LoadingSpinner'
import useWeatherOperations from '../hooks/useWeatherOperations'
import '../components/Dashboard.css'

const Dashboard = () => {
    const navigate = useNavigate()
    const inputRef = useRef()
    const [weatherCards, setWeatherCards] = useState([])
    const [loading, setLoading] = useState(true)
    const { getAccessTokenSilently } = useAuth0();
    
    const {
        suggestions,
        showSuggestions,
        handleInputChange,
        fetchWeatherData,
        formatTime,
        clearSuggestions
    } = useWeatherOperations()

    // Main cities to display on dashboard
    const mainCities = [
        { name: "Colombo", code: "1248991", color: "blue" },
        { name: "Tokyo", code: "1850147", color: "purple" },
        { name: "Liverpool", code: "2644210", color: "green" },
        { name: "Sydney", code: "2147714", color: "orange" },
        { name: "Boston", code: "4930956", color: "red" },
        { name: "Paris", code: "2988507", color: "teal" }
    ]

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
            const cityData = await fetchWeatherData(inputRef.current.value.trim(), token);
            navigate('/weather', { state: { cityData } });
            clearSuggestions();
        } catch (error) {
            alert("Failed to fetch weather data. Please try again.");
            // console.error('Search error:', error); // DEVELOPMENT: Commented for production
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSuggestionClick = async (cityName, cityCode) => {
        inputRef.current.value = cityName;
        clearSuggestions();
        
        try {
            const token = await getAccessTokenSilently({
                audience: 'this is a unique identifier',
                scope: 'openid profile email'
            });
            const cityData = await fetchWeatherData(cityCode, token);
            navigate('/weather', { state: { cityData } });
        } catch (error) {
            alert("Failed to fetch weather data. Please try again.");
            // console.error('Suggestion click error:', error); // DEVELOPMENT: Commented for production
        }
    };

    const loadDashboardData = async () => {
        setLoading(true)
        try {
            // console.log(' Starting to load dashboard data...'); // DEVELOPMENT: Commented for production
            const token = await getAccessTokenSilently({
                audience: 'this is a unique identifier',
                scope: 'openid profile email'
            });
            // console.log(' Got access token'); // DEVELOPMENT: Commented for production
            
            const weatherPromises = mainCities.map(async city => {
                try {
                    // console.log(` Fetching weather for ${city.name} (${city.code})`); // DEVELOPMENT: Commented for production
                    const data = await fetchWeatherData(city.code, token);
                    // console.log(` Got weather data for ${city.name}:`, data); // DEVELOPMENT: Commented for production
                    return { ...data, color: city.color };
                } catch (error) {
                    // console.error(` Error fetching weather for ${city.name}:`, error); // DEVELOPMENT: Commented for production
                    return null;
                }
            });
            
            const results = await Promise.all(weatherPromises);
            const validResults = results.filter(result => result !== null);
            // console.log(` Dashboard data loaded: ${validResults.length}/${mainCities.length} cities`); // DEVELOPMENT: Commented for production
            setWeatherCards(validResults);
        } catch (error) {
            // console.error(" Error loading dashboard data:", error); // DEVELOPMENT: Commented for production
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDashboardData()
    }, [])

    

    const handleCityClick = (cityData) => {
        navigate('/weather', { state: { cityData } });
    }

    const handleCloseCard = (cardId) => {
        setWeatherCards(prev => prev.filter(card => card.id !== cardId));
    }

    if (loading) {
        return <LoadingSpinner message="Loading weather data..." />
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="header-left">
                    <div className="weather-icon">☀️</div>
                    <h1>Weather App</h1>
                </div>
                 
            </div>

            {/* Search bar */}
            <div className="dashboard-search">
                <SearchBar
                    inputRef={inputRef}
                    onInputChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onSearch={handleSearch}
                    suggestions={suggestions}
                    showSuggestions={showSuggestions}
                    onSuggestionClick={handleSuggestionClick}
                />
            </div>

            <div className="weather-grid">
                {weatherCards.map((card) => (
                    <WeatherCard
                        key={card.id}
                        card={card}
                        onClick={handleCityClick}
                        onClose={handleCloseCard}
                        formatTime={formatTime}
                    />
                ))}
            </div>

            <div className="dashboard-footer">
                <p>2025 Ravindu Technologies</p>
            </div>
        </div>
    )
}

export default Dashboard