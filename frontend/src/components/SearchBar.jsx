import React from 'react'
import search_icon from '../assets/search.png'
import './SearchBar.css'

const SearchBar = ({ 
    inputRef, 
    onInputChange, 
    onKeyPress, 
    onSearch, 
    suggestions, 
    showSuggestions, 
    onSuggestionClick,
    placeholder = "Search for a city"
}) => {
    return (
        <div className='search-bar'>
            <input 
                ref={inputRef} 
                type="text" 
                placeholder={placeholder}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyPress={onKeyPress}
            />    
            <img src={search_icon} alt="search" onClick={onSearch} />
            
            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className='suggestions-dropdown'>
                    {suggestions.map((city) => (
                        <div 
                            key={city.CityCode} 
                            className='suggestion-item'
                            onClick={() => onSuggestionClick(city.CityName, city.CityCode)}
                        >
                            {city.CityName}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SearchBar
