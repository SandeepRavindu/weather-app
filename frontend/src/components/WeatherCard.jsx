import React from 'react'
import './WeatherCard.css'

const WeatherCard = ({ card, onClick, onClose, formatTime }) => {
    return (
        <div 
            className={`weather-card ${card.color}`}
            onClick={() => onClick(card)}
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
                <button 
                    className="close-btn"
                    onClick={(e) => {
                        e.stopPropagation()
                        onClose && onClose(card.id)
                    }}
                >
                    ×
                </button>
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
    )
}

export default WeatherCard
