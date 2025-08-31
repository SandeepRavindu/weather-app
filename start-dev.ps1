# PowerShell script to start both frontend and backend in development mode

Write-Host "Starting Weather App Development Environment..." -ForegroundColor Green

# Start backend in a new PowerShell window
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\USER\Desktop\weather app\backend'; npm run server"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend in a new PowerShell window
Write-Host "Starting Frontend Development Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\USER\Desktop\weather app\frontend'; npm run dev"

Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "Backend will run on: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend will run on: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
Read-Host
