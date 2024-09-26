import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../styles/Signup.css';  // Import the CSS file for the signup page
import { callApi } from '../common/apiUtils';  // Import the common API utility
import { BeatLoader } from 'react-spinners';  // Import BeatLoader

const MySwal = withReactContent(Swal);

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);  // Loading state for spinner
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);  // Start loading spinner

        const payload = { userName: name, email, password };

        const result = await callApi('/signup', payload);

        if (result) {
            MySwal.fire({
                position: 'top-end',
                icon: 'success',
                title: result.msg,
                showConfirmButton: false,
                timer: 2000,
                toast: true,
            });

            setTimeout(() => {
                navigate('/');
            }, 2000);
        }

        setLoading(false);  // Stop loading spinner
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
                                disabled={loading}  // Disable input while loading
                            />
                            <label>Name</label>
                        </div>
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
                        <div className="input-box">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}  // Disable input while loading
                            />
                            <label>Password</label>
                        </div>
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? <BeatLoader color="#ffffff" size={10} /> : 'Sign Up'}
                        </button>
                    </form>
                </div>
                <div className="loader-container">
                    <BeatLoader color="#36d7b7" loading={loading} size={15} />
                </div>
            </div>
        </div>
    );
}

export default Signup;
