import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import ForgotPassword from './components/ForgotPassword';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for the login page */}
          <Route path="/" element={<Login />} />

          {/* Route for the signup page */}
          <Route path="/signup" element={<Signup />} />

          {/* Route for the home page, accessible after login */}
          <Route path="/home" element={<Home />} />

          {/* Route for the forgot-password page */}
          <Route path="/forgot-password" element={<ForgotPassword />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
