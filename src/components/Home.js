import React from 'react';
import FileUpload from '../components/FileUpload';
import '../styles/Home.css';   // Import specific styles for the Home page

function Home() {
    const nameArray = 'Gstern'.split('');

    return (
        <>
            <div className='homeMainContainer'>
                <div className="hello-engineer-container" style={{ '--char-count': nameArray.length }}>
                    <p className="h">H</p>
                    <p className="i">i</p>
                    <p className="space"></p> {/* For spacing between words */}
                    {nameArray.map((char, index) => (
                        <p key={index} className={`char-${index}`}>{char}</p>
                    ))}
                </div>
                <div className="home-container">
                    <div className="home-content">
                        <FileUpload />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
