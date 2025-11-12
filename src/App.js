import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/Auth/LoginPage.jsx';
import RegistrationPage from './pages/Auth/RegistrationPage.jsx';
import RoomListPage from './pages/Room/RoomListPage.jsx'; 
import UsersPage from './pages/Info/UsersPage.jsx';

import { getCurrentUserToken } from './services/authService.jsx'; 

// Функція для перевірки статусу авторизації
const isLoggedIn = () => !!getCurrentUserToken();

// Компонент, що захищає маршрут
const ProtectedRoute = ({ element }) => {
    return isLoggedIn() ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* Перенаправлення з кореневого маршруту залежно від статусу */}
        <Route 
          path="/" 
          element={<Navigate to={isLoggedIn() ? "/rooms" : "/login"} replace />} 
        />

        {/* Маршрути авторизації: перенаправляють, якщо вже залогінений */}
        <Route 
          path="/login" 
          element={isLoggedIn() ? <Navigate to="/rooms" replace /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={isLoggedIn() ? <Navigate to="/rooms" replace /> : <RegistrationPage />} 
        />

        {/* Захищені маршрути: доступні лише після логіну */}
        <Route path="/users" element={<ProtectedRoute element={<UsersPage />} />} />
        <Route path="/rooms" element={<ProtectedRoute element={<RoomListPage />} />} />
        
        <Route path="*" element={<h1>404: Сторінку не знайдено</h1>} />

      </Routes>
    </Router>
  );
}

export default App;