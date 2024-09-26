import React, { useState } from 'react';
import '../styles/CreateFile.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { callApi } from '../common/apiUtils';  // Import the callApi utility
import { BeatLoader } from 'react-spinners';

function CreateFile() {
    const [jsonData, setJsonData] = useState({});
    const [currentFieldPath, setCurrentFieldPath] = useState('');
    const [currentFieldValue, setCurrentFieldValue] = useState('');
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [editFieldPath, setEditFieldPath] = useState('');
    const [editFieldValue, setEditFieldValue] = useState('');
    const [originalFieldPath, setOriginalFieldPath] = useState('');
    const [isFieldValueEditable, setIsFieldValueEditable] = useState(true);
    const [isHelpPopupOpen, setIsHelpPopupOpen] = useState(false);
    const [raceSeason, setRaceSeason] = useState('');
    const [carName, setCarName] = useState('');
    const [carModel, setCarModel] = useState('');
    const [showModal, setShowModal] = useState(false); // To show or hide the popup form
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Open and close modal
    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const addField = () => {
        if (currentFieldPath && currentFieldValue) {
            const newData = { ...jsonData };
            const keys = currentFieldPath.split('.');
            let currentLevel = newData;

            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (i === keys.length - 1) {
                    if (currentLevel[key] !== undefined) {
                        alert("This field already exists. Please use a different name.");
                        return;
                    }
                    currentLevel[key] = currentFieldValue;
                } else {
                    if (typeof currentLevel[key] !== 'object' || currentLevel[key] === null) {
                        currentLevel[key] = {};
                    }
                    currentLevel = currentLevel[key];
                }
            }

            setJsonData(newData);
            setCurrentFieldPath('');
            setCurrentFieldValue('');
        }
    };

    const deleteField = (path) => {
        const newData = { ...jsonData };
        const keys = path.split('.');
        let currentLevel = newData;

        for (let i = 0; i < keys.length - 1; i++) {
            currentLevel = currentLevel[keys[i]];
        }

        delete currentLevel[keys[keys.length - 1]];
        setJsonData(newData);
    };

    const editField = (path) => {
        const keys = path.split('.');
        let currentLevel = jsonData;

        for (let i = 0; i < keys.length - 1; i++) {
            currentLevel = currentLevel[keys[i]];
        }

        const fieldName = keys[keys.length - 1];
        const fieldValue = currentLevel[fieldName];

        setEditFieldPath(fieldName);
        setEditFieldValue(typeof fieldValue === 'object' ? JSON.stringify(fieldValue) : fieldValue);
        setOriginalFieldPath(path);
        setIsFieldValueEditable(typeof fieldValue !== 'object');
        setIsEditPopupOpen(true);
    };

    const updateFieldValue = () => {
        const newData = { ...jsonData };
        const keys = originalFieldPath.split('.');
        let currentLevel = newData;

        for (let i = 0; i < keys.length - 1; i++) {
            currentLevel = currentLevel[keys[i]];
        }

        delete currentLevel[keys[keys.length - 1]];
        currentLevel[editFieldPath] = isFieldValueEditable ? editFieldValue : JSON.parse(editFieldValue);

        setJsonData(newData);
        setIsEditPopupOpen(false);
        setEditFieldPath('');
        setEditFieldValue('');
        setOriginalFieldPath('');
    };

    const renderJsonFields = (data, path = '') => {
        return Object.keys(data).map((key) => {
            const currentPath = path ? `${path}.${key}` : key;
            if (typeof data[key] === 'object' && data[key] !== null) {
                return (
                    <div key={currentPath} className="json-field">
                        <strong>{key}:</strong>
                        <button className="edit-button" onClick={() => editField(currentPath)}>Edit</button>
                        <button className="delete-button" onClick={() => deleteField(currentPath)}>Delete</button>
                        <div className="json-subfields">
                            {renderJsonFields(data[key], currentPath)}
                        </div>
                    </div>
                );
            } else {
                return (
                    <div key={currentPath} className="json-field">
                        <strong>{key}:</strong> {data[key]}
                        <button className="edit-button" onClick={() => editField(currentPath)}>Edit</button>
                        <button className="delete-button" onClick={() => deleteField(currentPath)}>Delete</button>
                    </div>
                );
            }
        });
    };

    // Handle form submission and API call
    const handleSubmit = async () => {
        // console.log('Generated JSON:', jsonData);
        setLoading(true); // Start loading spinner
        if (!raceSeason) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Race season date is Required.',
                showConfirmButton: false,
                timer: 2000,
                toast: true,
            });
            return;
        }

        // Retrieve the token from sessionStorage or localStorage
        const token = sessionStorage.getItem('accessToken'); // or localStorage.getItem('accessToken')

        const payload = {
            flowType: "MANUAL",
            raceSeason: raceSeason,
            carName: carName,
            carModel: carModel,
            jsonData: jsonData
        };

        try {
            const response = await fetch('http://localhost:5555/upload/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                Swal.fire({
                    position: 'top-end',
                    timer: 2000,
                    showConfirmButton: false,
                    toast: true,
                    title: 'File uploaded successfully!',
                    icon: 'success',
                }).then(() => {
                    navigate('/home'); // Redirect to home page after success alert
                });

                handleCloseModal(); // Close the modal after successful submission
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Failed to upload file.',
                    showConfirmButton: false,
                    timer: 2000,
                    toast: true,
                });
            }
        } catch (error) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'An error occurred while uploading the data.',
                showConfirmButton: false,
                timer: 2000,
                toast: true,
            });
        } finally {
            setLoading(false); // Stop loading spinner
        }
    };

    const toggleHelpPopup = () => {
        setIsHelpPopupOpen(!isHelpPopupOpen);
    };

    return (
        <div className="create-file-container">
            <div className="loader-container">
                <BeatLoader color="#36d7b7" loading={loading} size={15} />
            </div>

            <div className="back-button-container">
                <button className="backButton point" onClick={() => navigate('/home')}>
                    <i className="fa-solid fa-arrow-left-long "></i> &nbsp; Back to home
                </button>
            </div>

            <div className="page">
                <div className="page__container">
                    <button className="open-popup" onClick={toggleHelpPopup}>Click to know how to make file ?</button>
                </div>
            </div>

            <div className={`popup ${isHelpPopupOpen ? 'open' : ''}`}>
                <div className="popup__block scrollbar" id="style-4">
                    <div className="tutorial-container force-overflow">
                        <h2>Steps to Create a Field:</h2>
                        <ol>
                            <li>
                                <strong>Add a Field:</strong>
                                <ul>
                                    <li><strong>Field Path Input Box:</strong> Enter the path of the field you want to create, using dot notation to define nested structures.</li>
                                    <li><strong>Field Value Input Box:</strong> Enter the value for the field you want to create.</li>
                                </ul>
                            </li>

                            <li><strong>Example 1 (Simple Field Creation):</strong></li>
                            <ul>
                                <li><strong>Field Path:</strong> <code>name</code></li>
                                <li><strong>Field Value:</strong> <code>John</code></li>
                            </ul>
                            <p>This will create the following JSON:</p>
                            <pre>
                                {`
                                    {
                                        "name": "John"
                                    }
                                    `}
                            </pre>

                            <li><strong>Example 2 (Nested Field Creation):</strong></li>
                            <p>To create the following JSON:</p>
                            <pre>
                                {`                
                                {
                                    "person": {
                                                "details":{
                                                             "names":{      
                                                                                "fname": "John"
                                                                              }
                                                                }
                                                    }
                                }
`}

                            </pre>

                            <ul>
                                <li><strong>Field Path:</strong> <code>person.details.names.fname</code></li>
                                <li><strong>Field Value:</strong> <code>John</code></li>
                            </ul>
                            <p>Click the <strong>"Add Field"</strong> button.</p>
                        </ol>

                        <h2>Steps to Add a Nested Field:</h2>
                        <p>You can create nested fields by using dot notation (<code>.</code>) in the field path. Each dot represents a deeper level in the JSON structure.</p>

                        <h3>Example (Creating a Nested Field):</h3>
                        <ul>
                            <li><strong>Field Path:</strong> <code>person.details.names.fname</code></li>
                            <li><strong>Field Value:</strong> <code>John</code></li>
                        </ul>
                        <p>This creates a nested structure inside <code>person</code> and <code>details</code> like this:</p>
                        <pre>
                            {`                
                                {
                                    "person": {
                                                "details":{
                                                             "names":{      
                                                                                "fname": "John"
                                                                              }
                                                                }
                                                    }
                                }
`}
                        </pre>

                        <h2>Steps to Add an Array Field:</h2>
                        <p>To create an array in the JSON structure, define the array in the <strong>Field Path</strong> as normal using dot notation, and enter the array in the <strong>Field Value</strong> input box.</p>

                        <h3>Example (Creating an Array):</h3>
                        <ul>
                            <li><strong>Field Path:</strong> <code>person.details.names.subjects</code></li>
                            <li><strong>Field Value:</strong> <code>[A, B, C, D]</code></li>
                        </ul>
                        <p>This will generate the following JSON:</p>
                        <pre>
                            {`                
                                {
                                    "person": {
                                                "details":{
                                                             "names":{      
                                                                                "fname": "John",
                                                                                "subjects": ["A", "B", "C", "D"]
                                                                              }
                                                                }
                                                    }
                                }
`}
                        </pre>

                        <h2>Preventing Duplicate Fields:</h2>
                        <p>The tool will prevent you from creating duplicate fields within the same path. For example, you cannot have two fields called <code>fname</code> at the same level under <code>person.details.names</code>. If you try to add a field with the same path, an error will appear notifying you that the field already exists.</p>

                        <h2>Steps to Edit a Field:</h2>
                        <ol>
                            <li>Click the <strong>"Edit"</strong> button next to the field you want to modify.</li>
                            <li>Modify the <strong>Field Path</strong> or <strong>Field Value</strong> in the popup that appears.</li>
                            <li>Click <strong>"Update"</strong> to save the changes.</li>
                        </ol>

                        <h2>Steps to Delete a Field:</h2>
                        <ol>
                            <li>Click the <strong>"Delete"</strong> button next to the field you want to remove.</li>
                            <li>This will remove the field from the JSON structure, including any nested fields.</li>
                        </ol>

                        <h2>Viewing Your JSON Structure:</h2>
                        <p>As you add fields, the JSON structure will be displayed below in real-time. You can view the generated structure, make edits, or delete fields as needed.</p>

                        <h2>Finalizing Your JSON:</h2>
                        <p>Once you have created your desired JSON structure and are satisfied with it, click the <strong>"Submit JSON"</strong> button to finalize and submit the data.</p>


                    </div>
                    {/* <button className="popup__close" >Close</button> */}
                    <div className="flex-container" onClick={toggleHelpPopup}>
                        <button className="item-6" >
                            <span className="inner">
                                <span className="label">Close</span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="input-container">
                <input
                    type="text"
                    placeholder="Enter field path (e.g., person.name.first)..."
                    value={currentFieldPath}
                    onChange={(e) => setCurrentFieldPath(e.target.value)}
                    className="input-field"
                />
                <input
                    type="text"
                    placeholder="Enter field value..."
                    value={currentFieldValue}
                    onChange={(e) => setCurrentFieldValue(e.target.value)}
                    className="input-field"
                />
                <button className="add-button" onClick={addField}>Add Field</button>
            </div>

            {/* Conditionally render JSON output and submit button */}
            {Object.keys(jsonData).length > 0 && (
                <>
                    <div className="json-output scrollbar" id="style-4">
                        <h2>Generated JSON:</h2>
                        <div className='force-overflow'>{renderJsonFields(jsonData)}</div>
                    </div>
                    <div className="json-output scrollbar" id="style-4">
                        <pre className='force-overflow'>{JSON.stringify(jsonData, null, 2)}</pre>
                    </div>
                    <button onClick={handleOpenModal} className="submit-button">Submit JSON</button>
                </>
            )}

            {isEditPopupOpen && (
                <div className="edit-popup">
                    <div className="edit-popup-content">
                        <h3>Edit Field Name and Value</h3>
                        <input
                            type="text"
                            value={editFieldPath}
                            onChange={(e) => setEditFieldPath(e.target.value)}
                            className="input-field"
                            placeholder="Field Name"
                        />
                        <input
                            type="text"
                            value={editFieldValue}
                            onChange={(e) => setEditFieldValue(e.target.value)}
                            className={`input-field ${isFieldValueEditable ? '' : 'disabled-field'}`}
                            placeholder="Field Value"
                            disabled={!isFieldValueEditable}
                        />
                        <button onClick={updateFieldValue} className="update-button">Update</button>
                        <button onClick={() => setIsEditPopupOpen(false)} className="cancel-button">Cancel</button>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="modal-background">
                    <div className="modal-container">
                        <button className="crossBtn point" onClick={handleCloseModal}>
                            <span className="crossBtnInner">
                                <span className="crossBtnLabel">Close</span>
                            </span>
                        </button>
                        <div className="popUpHeading">Enter Vehicle Details</div>

                        <div className="datepicker">Race Season *</div>
                        <input
                            type="date"
                            id="raceSeason"
                            value={raceSeason}
                            onChange={(e) => setRaceSeason(e.target.value)}
                            required
                            className="point"
                        />

                        <input
                            type="text"
                            id="carName"
                            value={carName}
                            onChange={(e) => setCarName(e.target.value)}
                            placeholder="Car Name"
                            required
                        />

                        <input
                            type="text"
                            id="carModel"
                            value={carModel}
                            onChange={(e) => setCarModel(e.target.value)}
                            placeholder="Car Model"
                            required
                        />

                        <button className="submitFile" onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default CreateFile;
