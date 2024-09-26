import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/Login.css';
import { callApi } from '../common/apiUtils';
import { BeatLoader } from 'react-spinners'; // Import BeatLoader

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loading spinner
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading spinner

        const payload = { email, password };

        const result = await callApi('/login', payload);

        if (result) {
            console.log(result); // Log the result

            // Assuming the response contains the access token and username
            const accessToken = result.access_token;
            const username = result.userName;

            // Save the access token and username in storage
            sessionStorage.setItem('accessToken', accessToken);
            localStorage.setItem('username', username);  // Store the username

            // Display success toast
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Login successful!',
                showConfirmButton: false,
                timer: 2000,
                toast: true,
            });

            // Navigate to home page after success
            setTimeout(() => {
                navigate('/home', { state: { username } });
            }, 2000);
        } else {
            // Show error toast if login fails
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Invalid email or password. Please try again!',
            });
        }

        setLoading(false); // Stop loading spinner
    };

    return (
        <div className='mainContainer'>
            <div className="loader-container">
                <BeatLoader color="#36d7b7" loading={loading} size={15} />
            </div>
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
