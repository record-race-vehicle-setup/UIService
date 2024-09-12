import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ForgotPassword.css';  // Import the CSS file

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        // Placeholder for API call to initiate password reset
        const response = await fetch('/api/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            alert('Password reset link sent to your email.');
            navigate('/');
        } else {
            alert('Failed to send reset link. Please check your email.');
        }
    };

    return (
        <div className="container">
            <div className="forgot-password-box">
                <h2>Forgot Password</h2>
                <form onSubmit={handleForgotPassword}>
                    <div className="input-box">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label>Email</label>
                    </div>
                    <button type="submit" className="btn">Send Reset Link</button>
                    <div className="login-link">
                        <a onClick={() => navigate('/')}>Back to Login</a>
                    </div>
                </form>
            </div>
            {[...Array(50)].map((_, i) => (
                <span key={i} style={{ "--i": i }}></span>
            ))}
        </div>
    );
}

export default ForgotPassword;
