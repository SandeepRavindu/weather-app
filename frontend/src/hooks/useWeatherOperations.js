import { useState } from 'react'
import citiesData from '../cities.json'

const useWeatherOperations = () => {
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)

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

    // Find city code by city name (enhanced matching)
    const findCityCode = (cityName) => {
        if (!cityName) return null;
        
        const searchName = cityName.toLowerCase().trim();
        
        // First try exact match
        let city = citiesData.List.find(
            city => city.CityName.toLowerCase() === searchName
        );
        
        // If no exact match, try partial match (starts with)
        if (!city) {
            city = citiesData.List.find(
                city => city.CityName.toLowerCase().startsWith(searchName)
            );
        }
        
        // If still no match, try contains match
        if (!city) {
            city = citiesData.List.find(
                city => city.CityName.toLowerCase().includes(searchName)
            );
        }
        
        // console.log(` City lookup: "${cityName}" -> ${city ? `${city.CityName} (${city.CityCode})` : 'Not found'}`); // DEVELOPMENT: Commented for production
        return city ? city.CityCode : null;
    };

    // Find city name by city code (for logging and display purposes)
    const findCityName = (cityCode) => {
        const city = citiesData.List.find(
            city => city.CityCode.toString() === cityCode.toString()
        );
        return city ? city.CityName : null;
    };

    // Get city suggestions
    const getCitySuggestions = (input) => {
        if (!input || input.length < 2) return [];
        const searchInput = input.toLowerCase();
        
        return citiesData.List.filter(city =>
            city.CityName.toLowerCase().includes(searchInput)
        ).slice(0, 8) // Show up to 8 suggestions
        .map(city => ({
            ...city,
            displayName: `${city.CityName}${city.CountryCode ? `, ${city.CountryCode}` : ''}`
        }));
    };

    // Handle input change for suggestions
    const handleInputChange = (value) => {
        const newSuggestions = getCitySuggestions(value);
        setSuggestions(newSuggestions);
        setShowSuggestions(newSuggestions.length > 0 && value.length > 1);
    };

    // Fetch weather data using your backend API (now requires auth token)
    const fetchWeatherData = async (cityInput, token) => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        let cityId;

        if (!token) {
            throw new Error('Authentication token is required');
        }

        // If input is numeric, use it as city ID directly
        if (!isNaN(cityInput)) {
            cityId = cityInput;
        } else {
            // If input is city name, find the city ID from local cities.json
            cityId = findCityCode(cityInput);
            
            if (!cityId) {
                throw new Error(`City "${cityInput}" not found in our database. Please try a different city name.`);
            }
        }

        try {
            // Use your backend endpoint with authorization header
            const apiUrl = `${backendUrl}/weather/${cityId}`;
            // console.log(` Fetching weather for city: ${cityInput} (ID: ${cityId}) from ${apiUrl}`); // DEVELOPMENT: Commented for production

            const response = await fetch(apiUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            // console.log(` Response status: ${response.status}`); // DEVELOPMENT: Commented for production
            
            const data = await response.json();

            if (!response.ok) {
                // console.error(' API Error Response:', data); // DEVELOPMENT: Commented for production
                throw new Error(data.error || 'Weather data not found');
            }
            
            // console.log(' Weather data received:', data); // DEVELOPMENT: Commented for production
            
            const icon = allIcons[data.weather[0].icon];
            return {
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
                location: data.name,
                // Additional info from your backend
                cached: data.cached || false
            };
        } catch (error) {
            // console.error(" Error fetching weather data:", error); // DEVELOPMENT: Commented for production
            throw error;
        }
    };

    // Format time helper
    const formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    };

    // Clear suggestions
    const clearSuggestions = () => {
        setShowSuggestions(false);
    };

    return {
        suggestions,
        showSuggestions,
        handleInputChange,
        fetchWeatherData,
        formatTime,
        clearSuggestions,
        findCityCode,
        findCityName
    };
};

export default useWeatherOperations;
