import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import '../styles/Home.css';

function Home() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    var storedUsername = ""
    useEffect(() => {
        // Retrieve the username from localStorage
        storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername); // Set the username state
            console.log(username)
        } else {
            // If no username is found, redirect to login
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        // Clear session and local storage
        sessionStorage.removeItem('accessToken');
        localStorage.removeItem('username');

        // Navigate to login page
        navigate('/');
    };

    const handleCreateFileClick = () => {
        navigate('/create-file');
    };

    const handleViewFilesClick = () => {
        navigate('/viewFiles');  // Redirect to viewFiles page
    };

    return (
        <>
            <div className='homeMainContainer'>
                {/* Logout Button in the top right corner */}
                <div className="logout-button" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i> Logout
                </div>

                <div className="hello-engineer-container">
                    <p className="h">H</p>
                    <p className="i">i</p>
                    <p className="space"></p>
                    {/* Split the username into individual characters */}
                    {Array.from(username).map((char, index) => (
                        <p key={index} className="char">{char}</p>
                    ))}
                </div>

                <div className="home-container">
                    <div className="home-content">
                        <button onClick={handleCreateFileClick} className="create-file-button">
                            Create File
                        </button>
                        <FileUpload />
                        <button onClick={handleViewFilesClick} className="view-file-button">
                            View Files
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
