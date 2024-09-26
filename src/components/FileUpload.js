import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';  // Use SweetAlert for notifications
import '../styles/FileUpload.css';

function FileUpload() {
    const [file, setFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [raceSeason, setRaceSeason] = useState('');
    const [carName, setCarName] = useState('');
    const [carModel, setCarModel] = useState('');
    const [fileNameDisplay, setFileNameDisplay] = useState(''); // State to hold file name display
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'application/json') {
            setFile(selectedFile);

            // SweetAlert for file selection success
            Swal.fire({
                position: 'top-end',
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                title: 'File selected successfully',
                icon: 'success',
            })

            // Set file name for display, truncate if necessary
            const displayName = selectedFile.name.length > 10
                ? `${selectedFile.name.substring(0, 10)}...`
                : selectedFile.name;
            setFileNameDisplay(displayName);
        } else {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Please upload a valid JSON file.',
                showConfirmButton: false,
                timer: 2000,
                toast: true,
            });
            event.target.value = ''; // Reset the input
        }
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    const resetForm = () => {
        setRaceSeason('');
        setCarName('');
        setCarModel('');
        setFile(null);
        setFileNameDisplay(''); // Clear file name display
    };

    const handleSubmit = () => {
        if (!raceSeason) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Please fill the race season date.',
                showConfirmButton: false,
                timer: 2000,
                toast: true,
            });
            return;
        }

        if (!file) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Please upload a valid JSON file.',
                showConfirmButton: false,
                timer: 2000,
                toast: true,
            });
            return;
        }

        const fileDetails = {
            fileName: file.name,
            fileSize: `${(file.size / 1024).toFixed(2)} KB`,
            fileType: file.type,
            method: "UPLOAD"
        };

        var formData = {
            "raceSeason": raceSeason,
            "carName": carName,
            "carModel": carModel
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const content = JSON.parse(e.target.result);
            navigate('/edit-json', {
                state: {
                    data: content,
                    fileDetails,
                    formData,
                }
            });
        };
        reader.readAsText(file);
    };

    return (
        <div className="file-upload-container">
            <button className="file-upload-button" onClick={handleOpenModal}>
                Upload File
            </button>

            {showModal && (
                <div className="modal-background">
                    <div className="modal-container">
                        <button className="crossBtn point">
                            <span className="crossBtnInner" onClick={handleCloseModal}>
                                <span className="crossBtnLabel">Close</span>
                            </span>
                        </button>
                        <div className='popUpHeading'>Enter Details</div>

                        <div className='datepicker'>Race Season *</div>
                        <input
                            type="date"
                            id="raceSeason"
                            value={raceSeason}
                            onChange={(e) => setRaceSeason(e.target.value)}
                            required
                            className='point'
                        />

                        <input
                            type="text"
                            id="carName"
                            value={carName}
                            onChange={(e) => setCarName(e.target.value)}
                            placeholder="Car Name"
                        />

                        <input
                            type="text"
                            id="carModel"
                            value={carModel}
                            onChange={(e) => setCarModel(e.target.value)}
                            placeholder="Car Model"
                        />

                        <input
                            type="file"
                            id="fileInput"
                            accept=".json"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="fileInput" className="file-upload-button2">
                            Upload File
                        </label>

                        {/* Display file name below the button */}
                        {fileNameDisplay && (
                            <div className="file-name-display">
                                {fileNameDisplay}
                            </div>
                        )}

                        <button className="submitFile" onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FileUpload;
