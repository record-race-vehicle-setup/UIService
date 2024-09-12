import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import ForgotPassword from './components/ForgotPassword';
import EditJson from './components/EditJson';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>

          <Route path="/" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/home" element={<Home />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/edit-json" element={<EditJson />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
