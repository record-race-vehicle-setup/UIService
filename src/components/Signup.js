import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../styles/Signup.css';  // Import the CSS file for the signup page
import { callApi } from '../common/apiUtils';  // Import the common API utility

const MySwal = withReactContent(Swal);

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        const payload = { userName: name, email, password };

        const result = await callApi('http://localhost:5555/signup', payload);

        if (result) {
            console.log(result); // Log response to console

            // SweetAlert2 success notification
            MySwal.fire({
                position: 'top-end',
                icon: 'success',
                title: result.msg,
                showConfirmButton: false,
                timer: 2000, // Display for 2 seconds
                toast: true,
            });

            // Navigate after the SweetAlert timer finishes
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }
    };

    return (
        <div className='mainContainer'>
            <div className="container">
                <div className="signup-box">
                    <h2>Sign Up</h2>

                    <form onSubmit={handleSignup}>
                        <div className="input-box">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <label>Name</label>
                        </div>
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
                        <button type="submit" className="btn">Sign Up</button>
                        <div className="login-link point">
                            <a onClick={() => navigate('/')}>Login</a>
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

export default Signup;
