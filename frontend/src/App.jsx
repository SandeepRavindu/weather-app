import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Weather from './pages/Weather.jsx'
import { useAuth0 } from '@auth0/auth0-react'

const App = () => {
  const { 
    isLoading, 
    isAuthenticated, 
    loginWithPopup,
    loginWithRedirect,
    logout,
    user,
    getAccessTokenSilently, 
  } = useAuth0();

  // DEVELOPMENT: Function to call protected API - COMMENTED FOR PRODUCTION
  // const callProtectedApi = async () => {
  //   try {
  //     const token = await getAccessTokenSilently({
  //       audience: 'this is a unique identifier',
  //       scope: 'openid profile email'
  //     });
  //     const response = await fetch('http://localhost:5000/protected', {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     const data = await response.json();
  //     console.log('Protected API Response:', data);
  //   } catch (error) {
  //     console.log('Error calling protected API:', error.message);
  //   }
  // };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }
  
  return (
    <Router>
      <div className='min-h-screen app'>
        {/* Header with Auth */}
        <header className="text-white bg-gray-800 bg-opacity-90 shadow-lg">
          <div className="container px-4 py-3 mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-blue-400">🌤️ Weather App</h1>
                <nav className="hidden space-x-4 md:flex">
                  <a href="/" className="transition-colors hover:text-blue-400">Dashboard</a>
                  <a href="/weather" className="transition-colors hover:text-blue-400">Weather</a>
                </nav>
              </div>
              
              {/* Auth Buttons */}
              <div className="flex items-center space-x-4">
                  {/* DEVELOPMENT: Multiple login options - COMMENTED FOR PRODUCTION */}
                {!isAuthenticated ? (
                  <>
                    {/* <button 
                      onClick={() => loginWithPopup()}
                      className="px-4 py-2 transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Login with Popup
                    </button> */}
                    <button 
                      onClick={() => loginWithRedirect()}
                      className="px-4 py-2 transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      Login
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-sm">
                      <span className="text-green-400">Logged in</span>
                    </div>
                    <button 
                      onClick={() => logout({ 
                        logoutParams: { 
                          returnTo: 'https://weather-app-frontend-ten-zeta.vercel.app' 
                        }
                      })}
                      className="px-4 py-2 transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* DEVELOPMENT: User Info Display - COMMENTED FOR PRODUCTION */}
        {/* {isAuthenticated && user && (
          <div className="text-white bg-gray-800 border-b border-gray-700">
            <div className="container px-4 py-2 mx-auto">
              <div className="flex items-center space-x-4 text-sm">
                <span>User is:</span>
                <span className="text-blue-400">
                  {JSON.stringify(user, null, 2)}
                </span>
              </div>
            </div>
          </div>
        )} */}

        {/* Main Content */}
        <main className="container px-4 py-6 mx-auto">
          {isAuthenticated ? (
            <>
              {/* DEVELOPMENT: Test Protected API Button - COMMENTED FOR PRODUCTION */}
              {/* <div className="mb-6">
                <button 
                  onClick={callProtectedApi}
                  className="px-4 py-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
                >
                  Test Protected API
                </button>
              </div> */}
              
              {/* Weather Routes - Only visible when authenticated */}
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/weather" element={<Weather />} />
              </Routes>
            </>
          ) : (
            <div className="text-center text-white">
              <div className="max-w-md p-8 mx-auto bg-gray-800 bg-opacity-90 rounded-lg shadow-lg backdrop-blur-sm">
                <h2 className="mb-4 text-2xl font-bold">Welcome to Weather App</h2>
                <p className="mb-6 text-gray-300">
                  Please log in to access weather information and forecasts.
                </p>
                <div className="space-y-3">
                  {/* DEVELOPMENT: Multiple login options - COMMENTED FOR PRODUCTION */}
                  {/* <button 
                    onClick={() => loginWithPopup()}
                    className="w-full px-4 py-3 transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Login with Popup
                  </button> */}
                  <button 
                    onClick={() => loginWithRedirect()}
                    className="w-full px-4 py-3 transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </Router>
  )
}

export default App
