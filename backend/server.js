// server.js
import express from "express";
import cors from "cors";
import "dotenv/config.js";
import connectDB from "./config/mongodb.js";
import WeatherCache from "./models/WeatherCache.js";
import { expressjwt as jwt } from 'express-jwt';
import jwks from 'jwks-rsa';
import axios from 'axios';

// If you're on Node < 18, uncomment the next line:
// import fetch from "node-fetch";

const app = express();
const port = process.env.PORT || 5000;

// Connect DB
await connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'], // Add both Vite ports
  credentials: true
}));
app.use(express.json());

// JWT middleware for protected routes
const verifyJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-now05oirf1dzrybm.us.auth0.com/.well-known/jwks.json',
  }),
  audience: 'this is a unique identifier',
  issuer: 'https://dev-now05oirf1dzrybm.us.auth0.com/',
  algorithms: ['RS256'],
});

// Don't apply JWT globally - we'll apply it to specific routes

// Error handling middleware for JWT errors
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    // console.error(' JWT Error:', err.message); // DEVELOPMENT: Commented for production
    return res.status(401).json({ 
      error: 'Invalid token', 
      message: err.message 
    });
  }
  next(err);
});

// Health check
app.get("/", (_req, res) => {
  res.send(" Weather API - Working!");
});

// ==========================================
// PROTECTED WEATHER ENDPOINTS (Auth Required)
// ==========================================

// DEVELOPMENT: Test protected endpoint - COMMENTED FOR PRODUCTION
// app.get("/protected", verifyJwt, async (req, res) => {
//   try {
//     const token = req.headers.authorization?.replace('Bearer ', '');
//     console.log(' Protected route accessed by authenticated user');
//     res.json({
//       message: 'This is protected data!',
//       user: req.user,
//       timestamp: new Date().toISOString()
//     });
//   } catch (error) {
//     console.error('Error in protected endpoint:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get weather by city ID - PROTECTED
app.get("/weather/:cityId", verifyJwt, async (req, res) => {
  const { cityId } = req.params;
  // console.log(` Weather request for city ID: ${cityId} by user: ${req.auth?.sub || 'unknown'}`); // DEVELOPMENT: Commented for production

  try {
    // 1) Check cache
    const now = Date.now();
    let cacheEntry = await WeatherCache.findOne({ cityId });

    if (cacheEntry && now - cacheEntry.cachedAt.getTime() < CACHE_DURATION) {
      // console.log(` Serving cached data for city ${cityId}`); // DEVELOPMENT: Commented for production
      return res.json({
        ...cacheEntry.data,
        cached: true
      });
    }

    // 2) Fetch fresh data
    const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=metric&appid=${process.env.OWM_KEY}`;
    const resp = await fetch(url);
    const data = await resp.json();

    if (!resp.ok) {
      // console.error(` OpenWeather API error for city ${cityId}:`, data); // DEVELOPMENT: Commented for production
      return res.status(resp.status).json({ error: data?.message || "Weather data not found" });
    }

    // 3) Cache the data
    if (cacheEntry) {
      cacheEntry.data = data;
      cacheEntry.cachedAt = new Date();
      await cacheEntry.save();
    } else {
      await WeatherCache.create({ cityId, data });
    }

    // console.log(` Fresh weather data served for city ${cityId}`); // DEVELOPMENT: Commented for production
    return res.json({
      ...data,
      cached: false
    });

  } catch (err) {
    // console.error(" Error in weather endpoint:", err); // DEVELOPMENT: Commented for production
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Get weather by city name (fallback for cities not in local database) - PROTECTED
app.get("/weather/search/:cityName", verifyJwt, async (req, res) => {
  const { cityName } = req.params;

  try {
    // First try to get by city name to get the city ID
    const searchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${process.env.OWM_KEY}`;
    const searchResp = await fetch(searchUrl);
    const searchData = await searchResp.json();

    if (!searchResp.ok) {
      return res.status(searchResp.status).json({ error: searchData?.message || "City not found" });
    }

    const cityId = searchData.id.toString();

    // Check cache using the city ID we just found
    const now = Date.now();
    let cacheEntry = await WeatherCache.findOne({ cityId });

    if (cacheEntry && now - cacheEntry.cachedAt.getTime() < CACHE_DURATION) {
      // console.log(` Serving cached data for city name: ${cityName}`); // DEVELOPMENT: Commented for production
      return res.json({
        ...cacheEntry.data,
        cached: true
      });
    }

    // Cache the fresh data we just fetched
    if (cacheEntry) {
      cacheEntry.data = searchData;
      cacheEntry.cachedAt = new Date();
      await cacheEntry.save();
    } else {
      await WeatherCache.create({ cityId, data: searchData });
    }

    // console.log(` Fresh weather data for city name: ${cityName}`); // DEVELOPMENT: Commented for production
    return res.json({
      ...searchData,
      cached: false
    });
  } catch (err) {
    // console.error(" Error in weather search endpoint:", err); // DEVELOPMENT: Commented for production
    return res.status(500).json({ error: "Server error" });
  }
});

// Start server (keep this after routes)
app.listen(port, () => console.log(` Server running on http://localhost:${port}`));
