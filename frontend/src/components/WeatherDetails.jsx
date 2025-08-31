import React from 'react'
import './WeatherDetails.css'

const WeatherDetails = ({ weatherData, formatTime }) => {
    return (
        <div className='weather-details'>
            <div className='details-layout'>
                {/* Left column - Atmospheric conditions */}
                <div className='details-column'>
                    <div className='detail-item'>
                        <span className='detail-label'>Pressure:</span>
                        <span className='detail-value'>{weatherData.pressure}hPa</span>
                    </div>
                    <div className='detail-item'>
                        <span className='detail-label'>Humidity:</span>
                        <span className='detail-value'>{weatherData.humidity}%</span>
                    </div>
                    <div className='detail-item'>
                        <span className='detail-label'>Visibility:</span>
                        <span className='detail-value'>{weatherData.visibility}.0km</span>
                    </div>
                </div>

                {/* Center column - Wind information */}
                <div className='details-column center-column'>
                    <div className='wind-section'>
                        <div className='wind-icon'>🌬️</div>
                        <div className='wind-text'>
                            {weatherData.windSpeed} m/s {weatherData.windDegree || 0}° Degree
                        </div>
                    </div>
                </div>

                {/* Right column - Sun times */}
                <div className='details-column'>
                    <div className='detail-item'>
                        <span className='detail-label'>Sunrise:</span>
                        <span className='detail-value'>{formatTime(weatherData.sunrise)}</span>
                    </div>
                    <div className='detail-item'>
                        <span className='detail-label'>Sunset:</span>
                        <span className='detail-value'>{formatTime(weatherData.sunset)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WeatherDetails
