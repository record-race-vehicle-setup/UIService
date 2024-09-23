import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import '../styles/Home.css';

function Home() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Retrieve the username from localStorage
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            // If no username is found, redirect to login
            navigate('/login');
        }
    }, [navigate]);

    const handleCreateFileClick = () => {
        navigate('/create-file');
    };

    return (
        <>
            <div className='homeMainContainer'>
                <div className="hello-engineer-container">
                    <p className="h">H</p>
                    <p className="i">i</p>
                    <p className="space"></p>
                    {/* Display dynamic username */}
                    <p>{username}</p>
                </div>
                <div className="home-container">
                    <div className="home-content">
                        <button onClick={handleCreateFileClick} className="create-file-button">
                            Create File
                        </button>
                        <FileUpload />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
