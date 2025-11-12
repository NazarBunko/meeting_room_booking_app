import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/Auth/LoginPage.jsx';
import RegistrationPage from './pages/Auth/RegistrationPage.jsx';
import RoomListPage from './pages/Room/RoomListPage.jsx'; 
import UsersPage from './pages/Info/UsersPage.jsx';
import BookingListPage from './pages/Booking/BookingListPage.jsx';

import { getCurrentUserToken } from './services/authService.js';

const isLoggedIn = () => !!getCurrentUserToken();

const ProtectedRoute = ({ element }) => {
    return isLoggedIn() ? element : <Navigate to="/login" replace />;
};

const AuthRedirectIfLoggedIn = ({ element }) => {
    return isLoggedIn() ? <Navigate to="/rooms" replace /> : element;
};


function App() {
  return (
    <Router>
      <Routes>

        <Route 
          path="/" 
          element={<Navigate to={isLoggedIn() ? "/rooms" : "/login"} replace />} 
        />

        <Route 
          path="/login" 
          element={<AuthRedirectIfLoggedIn element={<LoginPage />} />} 
        />
        <Route 
          path="/register" 
          element={<AuthRedirectIfLoggedIn element={<RegistrationPage />} />} 
        />

        <Route path="/users" element={<ProtectedRoute element={<UsersPage />} />} />
        <Route path="/bookings" element={<ProtectedRoute element={<BookingListPage />} />} />
        <Route path="/rooms" element={<ProtectedRoute element={<RoomListPage />} />} />
        
        <Route path="*" element={<h1>404: Сторінку не знайдено</h1>} />

      </Routes>
    </Router>
  );
}

export default App;