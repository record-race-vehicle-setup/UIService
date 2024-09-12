import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';  // Import the CSS file

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        // Placeholder for API call to login the user
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            navigate('/home');
        } else {
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className='mainContainer'>
            <div className="container">
                <div className="login-box">
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="input-box">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label>Email</label>
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label>Password</label>
                        </div>
                        <div className="forgot-pass point">
                            <a onClick={() => navigate('/forgot-password')}>Forgot your password?</a>
                        </div>
                        <button type="submit" className="btn">Login</button>
                        <div className="signup-link point">
                            <a onClick={() => navigate('/signup')}>Signup</a>
                        </div>
                    </form>
                </div>
                {[...Array(50)].map((_, i) => (
                    <span key={i} style={{ "--i": i }}></span>
                ))}
            </div>
        </div>
    );
}

export default Login;
