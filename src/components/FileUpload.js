import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FileUpload.css';

function FileUpload() {
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'application/json') {
            setFile(selectedFile);
        } else {
            showErrorMessage('Please upload a valid JSON file.');
            event.target.value = ''; // Reset the input
        }
    };

    const handleUpload = () => {
        if (file) {
            // Assuming you want to pass the file content to another component
            const reader = new FileReader();
            reader.onload = function (e) {
                const content = JSON.parse(e.target.result);
                navigate('/edit-json', { state: { data: content } });
            };
            reader.readAsText(file);
        }
    };

    const showErrorMessage = (message) => {
        const errorBox = document.getElementById('errorBox');
        errorBox.innerText = message;
        errorBox.style.display = 'block';
        setTimeout(() => {
            errorBox.style.display = 'none';
        }, 3000);
    };

    return (
        <div className="file-upload-container">
            <input
                type="file"
                id="fileInput"
                accept=".json"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            <label htmlFor="fileInput" className="file-upload-button">
                Upload File
            </label>
            <button className="btn upload-btn" onClick={handleUpload} disabled={!file}>
                Submit
            </button>
            <div id="errorBox" className="error-message">Error Message</div>
        </div>
    );
}

export default FileUpload;
