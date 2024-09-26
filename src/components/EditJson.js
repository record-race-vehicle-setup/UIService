import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/EditJson.css';
import { callApi } from '../common/apiUtils';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';

function EditJson() {
    const location = useLocation();
    const [jsonData, setJsonData] = useState(location.state.data);
    const [searchTerm, setSearchTerm] = useState('');
    const inputRefs = useRef({});
    const [showTopButton, setShowTopButton] = useState(false);
    const [fileDetails, setFileDetails] = useState(location.state?.fileDetails || null); // File details if passed
    const [formData, setFileDetails2] = useState(location.state?.formData || null); // File details if passed
    const navigate = useNavigate();
    const [submitFunction, setSubmitFunction] = useState(null); // State to hold the appropriate submit function
    const [loading, setLoading] = useState(false); // State to handle loading spinner

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
        setLoading(true); // Start loading spinner

        // console.log("File Details:", fileDetails);
        // console.log("formData:", formData);

        // Step 1: Prepare the presignPayload
        // Prepare the presignPayload depending on the structure of fileDetails
        const presignPayload = {
            fileName: fileDetails.fileName,
            fileSize: fileDetails.fileSize, // Assuming fileSize is available or can be set
            fileType: fileDetails.fileType
        };


        try {
            // First API Call - Get presigned URL (POST)
            const presignResponse = await callApi('/presign/url', presignPayload, 'POST');

            if (presignResponse && presignResponse.presigned_url) {
                // console.log('Presign Response:', presignResponse);
                const presignedUrl = presignResponse.presigned_url;

                // Step 2: Upload the JSON data using PUT
                const putOptions = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(jsonData) // Sending updated JSON data
                };

                const uploadResponse = await fetch(presignedUrl, putOptions);

                if (uploadResponse.ok) {
                    // Extract 'x-amz-version-id' from response headers
                    const versionId = uploadResponse.headers.get('x-amz-version-id');
                    // console.log('x-amz-version-id:', versionId);

                    // Step 3: Call the final API with 'uploadPayload'
                    const uploadPayload = {
                        flowType: 'FILE',
                        raceSeason: formData.raceSeason,
                        carName: formData.carName,
                        carModel: formData.carModel,
                        fileName: fileDetails.fileName,
                        fileId: versionId,  // Set the x-amz-version-id value
                        jsonData  // Send the edited jsonData
                    };

                    const finalResponse = await callApi('/upload/data', uploadPayload, 'POST');

                    if (finalResponse) {
                        // console.log('Final Upload Response:', finalResponse);

                        // Show success SweetAlert
                        Swal.fire({
                            position: 'top-end',
                            timer: 2000,
                            showConfirmButton: false,
                            toast: true,
                            title: 'Your file has been uploaded successfully.',
                            icon: 'success',
                        }).then(() => {
                            // Redirect to the home page
                            navigate('/home');
                        });

                    }
                } else {
                    // console.error('Failed to upload file to S3:', uploadResponse.statusText);
                }
            }
        } catch (error) {
            // console.error('Error in API Call:', error);
        } finally {
            setLoading(false); // Stop loading spinner
        }
    };

    const editJsonFile = async () => {
        setLoading(true); // Start loading spinner
        const token = sessionStorage.getItem('accessToken'); // Get the token for authorization
        const raceId = fileDetails?.id; // Get the race ID from fileDetails

        if (!raceId) {
            console.error("Race ID is missing");
            return;
        }

        const payload = {
            jsonData: jsonData // The updated JSON data
        };

        try {
            const response = await fetch(`http://localhost:5555/edit/race/${raceId}`, {
                method: 'POST', // Use PUT to update existing resources
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Authorization header
                },
                body: JSON.stringify(payload) // Send the JSON data as the payload
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Successfully updated:", result);

            // Show success alert using SweetAlert
            Swal.fire({
                position: 'top-end',
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                title: 'Your file has been successfully updated.',
                icon: 'success',
            }).then(() => {
                // Redirect to home page or any other action
                navigate('/home');
            });

        } catch (error) {
            console.error('Error updating the race data:', error);
        } finally {
            setLoading(false); // Stop loading spinner
        }
    };


    // Log file details to the console
    useEffect(() => {
        if (fileDetails) {
            // console.log("File Details:", fileDetails);

            // Check for the method and set the appropriate submit function
            if (fileDetails.method == 'UPLOAD') {
                setSubmitFunction(() => handleSubmit);
            } else if (fileDetails.method == 'EDITFILE') {
                setSubmitFunction(() => editJsonFile);
            }
        }
    }, [fileDetails]);

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
            <div className="loader-container">
                <BeatLoader color="#36d7b7" loading={loading} size={15} />
            </div>

            <div className="back-button-container">
                <button className="backButton point" onClick={() => navigate('/home')}>
                    <i className="fa-solid fa-arrow-left-long "></i> &nbsp; Back to home
                </button>
            </div>
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
                {submitFunction && (
                    <button onClick={submitFunction} className="submit-button">Submit Changes</button>
                )}
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
