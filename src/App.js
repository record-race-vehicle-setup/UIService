import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import ForgotPassword from './components/ForgotPassword';
import EditJson from './components/EditJson';
import CreateFile from './components/CreateFile';
import ResetPassword from './components/ResetPassword';
import ViewFiles from './components/viewFiles';

function PrivateRoute({ children }) {
  const token = sessionStorage.getItem('accessToken');
  return token ? children : <Navigate to="/" />; // Redirect to login if no token is found
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:id" element={<ResetPassword />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/viewFiles"
            element={
              <PrivateRoute>
                <ViewFiles />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-json"
            element={
              <PrivateRoute>
                <EditJson />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-file"
            element={
              <PrivateRoute>
                <CreateFile />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
