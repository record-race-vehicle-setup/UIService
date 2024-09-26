import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ForgotPassword.css';  // Import the CSS file
import Swal from 'sweetalert2';
import { callApi } from '../common/apiUtils';
import { BeatLoader } from 'react-spinners';  // Import BeatLoader

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);  // Loading state for spinner
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);  // Start loading spinner

        // Placeholder for API call to initiate password reset
        const response = await callApi('/reset/pwd/request', { email });

        if (response && response.message.includes('Password reset link sent')) {
            Swal.fire({
                position: 'top-end',
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                title: 'Password reset link sent to your email.',
                icon: 'success',
            }).then(() => {
                // Redirect to the home page
                navigate('/home');
            });
        } else if (response && response.message.includes('Invalid email')) {
            // Handle invalid email case
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Failed to send reset link. Invalid email.',
                showConfirmButton: false,
                timer: 2000,
                toast: true,
            });
        } else {
            // Handle other failure cases
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Failed to send reset link. Please check your email.',
                showConfirmButton: false,
                timer: 2000,
                toast: true,
            });
        }

        setLoading(false);  // Stop loading spinner
    };

    return (
        <div className='mainContainer'>
            <div className="loader-container">
                <BeatLoader color="#36d7b7" loading={loading} size={15} />
            </div>
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
                                disabled={loading}  // Disable input while loading
                            />
                            <label>Email</label>
                        </div>
                        <button type="submit" className="btn">Send Reset Link</button>
                        <div className="login-link point">
                            <a onClick={() => !loading && navigate('/')}>Back to Login</a>
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

export default ForgotPassword;
