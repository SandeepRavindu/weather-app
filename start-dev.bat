@echo off
echo ===============================================
echo        🌤️  Simple Weather App
echo ===============================================
echo.

echo 🔧 Starting Backend Server...
start "Backend Server" powershell -NoExit -Command "cd 'c:\Users\USER\Desktop\weather app\backend'; Write-Host '🚀 Backend Server Starting...' -ForegroundColor Green; npm run server"

timeout /t 4 /nobreak >nul

echo 🔧 Starting Frontend Development Server...  
start "Frontend Dev Server" powershell -NoExit -Command "cd 'c:\Users\USER\Desktop\weather app\frontend'; Write-Host '🚀 Frontend Server Starting...' -ForegroundColor Cyan; npm run dev"

echo.
echo ✅ Both servers are starting...
echo.
echo 📋 URLs:
echo    Backend API: http://localhost:5000
echo    Frontend:    http://localhost:5173
echo.
echo 🌤️  Features:
echo    ✅ Weather data from OpenWeather API
echo    ✅ Smart city search with autocomplete
echo    ✅ Server-side caching (5 minutes)
echo    ✅ No authentication required
echo.
echo 📝 Usage:
echo    1. Open http://localhost:5173
echo    2. Search for any city
echo    3. View current weather conditions
echo    4. Data is cached for better performance
echo.
echo Press any key to close this window...
pause >nul
