import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/ResetPassword.css';
import { callApi } from '../common/apiUtils';
import { BeatLoader } from 'react-spinners';  // Import BeatLoader

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);  // Loading state for spinner
    const navigate = useNavigate();
    const { id } = useParams(); // Extracting the id from the URL

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);  // Start loading spinner

        if (password !== confirmPassword) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Passwords do not match!',
                showConfirmButton: false,
                timer: 2000,
                toast: true
            });
            setLoading(false);  // Stop loading spinner
            return;
        }

        const payload = { password };

        try {
            const result = await callApi(`/reset-password/${id}`, payload);

            if (result) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Password reset successfully',
                    showConfirmButton: false,
                    timer: 2000,
                    toast: true,
                }).then(() => {
                    navigate('/');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to reset password. Please try again!',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred. Please try again!',
            });
        }

        setLoading(false);  // Stop loading spinner
    };

    return (
        <div className='mainContainer'>
            <div className="container">
                <div className="reset-password-box">
                    <h2>Reset Password</h2>
                    <form onSubmit={handleSubmit}>
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
                        <div className="input-box">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}  // Disable input while loading
                            />
                            <label>Confirm Password</label>
                        </div>
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? <BeatLoader color="#ffffff" size={10} /> : 'Reset Password'}
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

export default ResetPassword;
