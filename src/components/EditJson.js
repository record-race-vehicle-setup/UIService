import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/EditJson.css';

function EditJson() {
    const location = useLocation();
    const [jsonData, setJsonData] = useState(location.state.data);
    const [searchTerm, setSearchTerm] = useState('');
    const inputRefs = useRef({});
    const [showTopButton, setShowTopButton] = useState(false);

    const handleInputChange = (e, path) => {
        const { value } = e.target;
        const keys = path.split('.');
        setJsonData((prevData) => {
            const updatedData = { ...prevData };
            let current = updatedData;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return updatedData;
        });
    };

    const handleSearch = () => {
        const key = Object.keys(inputRefs.current).find((k) => k.includes(searchTerm));
        if (key && inputRefs.current[key]) {
            const element = inputRefs.current[key];
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - 60; // Adjusted for fixed header
            window.scrollTo({ top: elementPosition, behavior: 'smooth' });
            element.focus({ preventScroll: true });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleScroll = () => {
        if (window.scrollY > 200) {
            setShowTopButton(true);
        } else {
            setShowTopButton(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('YOUR_API_ENDPOINT_HERE', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            console.log('Success:', result);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const renderJsonFields = (data, parentKey = '') => {
        return Object.keys(data).map((key) => {
            const currentKey = parentKey ? `${parentKey}.${key}` : key;
            if (typeof data[key] === 'object' && data[key] !== null) {
                return (
                    <div key={currentKey} className="json-field">
                        <label>{key}</label>
                        <div className="json-subfields">
                            {renderJsonFields(data[key], currentKey)}
                        </div>
                    </div>
                );
            } else {
                return (
                    <div key={currentKey} className="json-field">
                        <label>{key}</label>
                        <input
                            type="text"
                            name={currentKey}
                            value={data[key]}
                            onChange={(e) => handleInputChange(e, currentKey)}
                            ref={(el) => (inputRefs.current[currentKey] = el)}
                        />
                    </div>
                );
            }
        });
    };

    return (
        <div className="edit-json-container">
            <div className="container2">
                <div className="center">
                    <h1 className="type">Edit File Data</h1>
                </div>
            </div>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search field..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-button">Search</button>
                <button onClick={handleSubmit} className="submit-button">Submit Changes</button>
            </div>
            <div id="content" className="json-editor contentDiv">
                {renderJsonFields(jsonData)}
            </div>
            <button
                className={`back-to-top ${showTopButton ? 'show' : ''}`}
                onClick={scrollToTop}
            />
        </div>
    );
}

export default EditJson;
