# 🌤️ Weather App

A modern, full-stack weather application built with React and Node.js, featuring secure authentication and real-time weather data from multiple cities around the world.

![Weather App](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

📖 User Manual
1. Getting Started

Visit the deployed application:
👉 Weather App (https://weather-app-frontend-ten-zeta.vercel.app/)

Click on Log In to begin.

2. Login & Authentication

Enter your email and password.

Complete Multi-Factor Authentication (MFA):

By default, you may be asked for a one-time code from Google Authenticator (or another authenticator app).

If you prefer email verification:

Click “Try another method”.

Select Email.

Enter the one-time code you receive in your inbox.

✅ Tip: If you don’t see the email, check your Spam/Promotions folder.

3. Dashboard

After login, you’ll see the Dashboard with weather cards for some main cities (e.g., Colombo, Tokyo, Paris, Sydney, etc.).

Each card shows:

City name

Current temperature

Weather condition (icon + description)

Additional info like min/max temperature, pressure, humidity, sunrise/sunset.

🔍 Click any card to view detailed weather information.

4. Search Function

Use the Search Bar to look up any city.

Start typing — the app will show suggestions from the city list.

Select a city or press Enter to fetch its weather.

Weather data includes:

City name & country

Current temperature

Weather condition (clear, cloudy, rain, etc.)

Min/Max temp, pressure, humidity, wind speed, sunrise/sunset.

5. Data Caching

To optimize performance, weather results are cached for 5 minutes.

If you search the same city again within 5 minutes, cached data is shown (no extra API calls).

After 5 minutes, fresh data will be fetched from OpenWeatherMap.

6. Logout

To end your session securely, click the Logout button.

## 🚀 Features

### Core Functionality
- **🌍 Global Weather Data**: Real-time weather information for cities worldwide
- **🔐 Secure Authentication**: Auth0 integration with JWT token-based security
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS
- **💾 Smart Caching**: 5-minute MongoDB cache for optimized API usage
- **🔍 Intelligent Search**: City search with autocomplete suggestions
- **📊 Detailed Weather Info**: Temperature, humidity, pressure, wind, sunrise/sunset

### Technical Features
- **⚡ Fast Performance**: Vite-powered React frontend
- **🛡️ API Protection**: All weather endpoints secured with JWT authentication
- **🗄️ Database Integration**: MongoDB with Mongoose ODM
- **🌐 CORS Enabled**: Cross-origin resource sharing configured
- **📈 Error Handling**: Comprehensive error handling and user feedback

## 🏗️ Tech Stack

### Frontend
- **React 19.1.1** - Modern JavaScript library for building user interfaces
- **Vite 7.1.2** - Fast build tool and development server
- **React Router DOM 7.8.2** - Client-side routing
- **Auth0 React SDK 2.4.0** - Authentication and authorization
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Axios 1.11.0** - Promise-based HTTP client

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js 5.1.0** - Web application framework
- **MongoDB** - NoSQL database for caching
- **Mongoose 8.18.0** - MongoDB object modeling
- **Express-JWT 8.5.1** - JWT middleware for Express
- **JWKS-RSA 3.2.0** - RSA key verification for JWT
- **CORS 2.8.5** - Cross-Origin Resource Sharing middleware

### External APIs
- **OpenWeatherMap API** - Weather data provider
- **Auth0** - Authentication and authorization service

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 16+ recommended)
- **npm** or **yarn** package manager
- **MongoDB** database (local or cloud)
- **Auth0 account** for authentication
- **OpenWeatherMap API key**

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd weather-app
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# OpenWeatherMap API
OWM_KEY=your_openweathermap_api_key

# Auth0 Configuration
AUTH0_DOMAIN=your_auth0_domain
AUTH0_AUDIENCE=your_auth0_audience
AUTH0_ISSUER_BASE_URL=https://your_auth0_domain

# Server Configuration
PORT=5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
# Auth0 Configuration
VITE_AUTH0_DOMAIN=your_auth0_domain
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_AUTH0_AUDIENCE=your_auth0_audience

# Backend API URL
VITE_BACKEND_URL=http://localhost:5000
```

### 4. Auth0 Configuration

#### Create Auth0 Application
1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Create a new Single Page Application
3. Configure the following settings:
   - **Allowed Callback URLs**: `http://localhost:5173`
   - **Allowed Logout URLs**: `http://localhost:5173`
   - **Allowed Web Origins**: `http://localhost:5173`

#### Create Auth0 API
1. Go to APIs section in Auth0 Dashboard
2. Create a new API
3. Set the **Identifier** (this will be your audience)
4. Choose **RS256** as the signing algorithm

### 5. MongoDB Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB locally and start the service
mongod --dbpath /path/to/your/db
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string and add to `.env` file

### 6. OpenWeatherMap API Key
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Add it to your backend `.env` file

## 🚀 Running the Application

### Development Mode

#### Start Backend Server
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

#### Start Frontend Development Server
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Production Mode

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Start Production Server
```bash
cd backend
npm start
```

## 📁 Project Structure

```
weather-app/
│
├── backend/
│   ├── config/
│   │   └── mongodb.js          # Database connection
│   ├── controllers/            # Route controllers (if applicable)
│   ├── middleware/             # Custom middleware
│   ├── models/
│   │   └── WeatherCache.js     # Weather cache model
│   ├── routers/                # Route definitions (if applicable)
│   ├── .env                    # Environment variables
│   ├── .env.example           # Environment template
│   ├── .gitignore             # Git ignore rules
│   ├── package.json           # Backend dependencies
│   └── server.js              # Main server file
│
├── frontend/
│   ├── public/
│   │   └── vite.svg           # Vite logo
│   ├── src/
│   │   ├── assets/            # Images and static assets
│   │   ├── components/        # Reusable React components
│   │   │   ├── Dashboard.jsx  # Dashboard component
│   │   │   ├── SearchBar.jsx  # Search functionality
│   │   │   ├── WeatherCard.jsx # Weather display cards
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   └── useWeatherOperations.js # Weather operations hook
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx  # Main dashboard page
│   │   │   └── Weather.jsx    # Individual weather page
│   │   ├── App.jsx            # Main React component
│   │   ├── cities.json        # City database for search
│   │   ├── index.css          # Global styles
│   │   └── main.jsx           # React entry point
│   ├── .env                   # Frontend environment variables
│   ├── .env.example          # Frontend environment template
│   ├── .gitignore            # Git ignore rules
│   ├── index.html            # HTML template
│   ├── package.json          # Frontend dependencies
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── vite.config.js        # Vite configuration
│
├── .gitignore                 # Root git ignore
└── README.md                  # This file
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
- `MONGODB_URI` - MongoDB connection string
- `OWM_KEY` - OpenWeatherMap API key
- `AUTH0_DOMAIN` - Auth0 domain
- `AUTH0_AUDIENCE` - Auth0 API audience
- `AUTH0_ISSUER_BASE_URL` - Auth0 issuer URL
- `PORT` - Server port (default: 5000)

#### Frontend (.env)
- `VITE_AUTH0_DOMAIN` - Auth0 domain
- `VITE_AUTH0_CLIENT_ID` - Auth0 client ID
- `VITE_AUTH0_AUDIENCE` - Auth0 API audience
- `VITE_BACKEND_URL` - Backend API URL

### Default Cities
The app displays weather for 6 major cities by default:
- Colombo, Sri Lanka
- Tokyo, Japan
- Liverpool, UK
- Sydney, Australia
- Boston, USA
- Paris, France

## 🔐 Security Features

- **JWT Authentication**: All weather API endpoints are protected
- **CORS Configuration**: Properly configured cross-origin requests
- **Environment Variables**: Sensitive data stored securely
- **Auth0 Integration**: Industry-standard authentication service
- **Input Validation**: Server-side validation for all requests

## 📱 User Interface

### Dashboard Page
- Overview of 6 major cities with current weather
- Search functionality with autocomplete
- Responsive grid layout
- Click on any city card to view detailed weather

### Weather Detail Page
- Comprehensive weather information
- Current temperature and conditions
- Min/max temperatures
- Humidity, pressure, and visibility
- Wind speed and direction
- Sunrise and sunset times

### Authentication
- Secure login with Auth0
- Session management
- Protected routes

## 🐛 Troubleshooting

### Common Issues

#### 1. Authentication Errors (401)
- Verify Auth0 configuration in both frontend and backend
- Ensure audience matches between client and API
- Check if user is properly logged in

#### 2. API Rate Limiting
- Check OpenWeatherMap API key validity
- Monitor API usage limits
- Verify caching is working (check MongoDB)

#### 3. CORS Errors
- Ensure frontend URL is in backend CORS configuration
- Check if both servers are running on correct ports

#### 4. Database Connection Issues
- Verify MongoDB connection string
- Check database permissions
- Ensure MongoDB service is running

### Debug Mode
To enable debug logging, uncomment the console.log statements in:
- `frontend/src/hooks/useWeatherOperations.js`
- `frontend/src/pages/Dashboard.jsx`
- `backend/server.js`

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables in deployment platform

### Backend Deployment (Heroku/Railway)
1. Ensure all dependencies are in `package.json`
2. Configure environment variables
3. Deploy with: `git push heroku main`

### Environment-specific Configuration
- Update CORS origins for production URLs
- Use production MongoDB cluster
- Configure production Auth0 settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Ravindu Technologies**
- Development Year: 2025

## 🙏 Acknowledgments

- **OpenWeatherMap** for weather data API
- **Auth0** for authentication services
- **MongoDB** for database services
- **React** and **Vite** communities for excellent tools
- **Tailwind CSS** for styling framework

---

### 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review environment variable configuration
3. Verify all services are running
4. Check browser console for error messages

**Happy Coding! 🌤️**
