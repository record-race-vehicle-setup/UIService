import React, { useState } from 'react';
import '../styles/CreateFile.css';

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

    const handleSubmit = () => {
        console.log('Generated JSON:', jsonData);
        // You can implement an API call or save functionality here
    };

    const toggleHelpPopup = () => {
        setIsHelpPopupOpen(!isHelpPopupOpen);
    };

    return (
        <div className="create-file-container">
            <div className="page">
                <div className="page__container">
                    <button className="open-popup" onClick={toggleHelpPopup}>Click to know how to make file ?</button>
                </div>
            </div>

            <div className={`popup ${isHelpPopupOpen ? 'open' : ''}`}>
                <div className="popup__block">
                    <div className="tutorial-container">
                        <h2>How to Create Your JSON File</h2>
                        <p>Welcome! This tool helps you create a JSON file with nested fields. Follow these steps:</p>
                        <ol>
                            <li>
                                <strong>Add a Field:</strong> Enter a name for your field in the first input box and its value in the second box, then click "Add Field".
                                <ul>
                                    <li>Example: To create a field called "name" with the value "John", enter "name" in the first box and "John" in the second box.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Add a Nested Field:</strong> If you want to create a nested structure (e.g., a person's first and last name under "name"), enter the full path using dot notation.
                                <ul>
                                    <li>Example: To add "first" and "last" under "name", first create "name", then enter "name.first" with the value "John".</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Delete a Field:</strong> To delete a field, click the "Delete" button next to it in the generated JSON structure.
                            </li>
                            <li>
                                <strong>No Duplicate Fields:</strong> The tool will prevent you from creating duplicate fields with the same name at the same level.
                            </li>
                            <li>
                                <strong>View Your JSON:</strong> As you add fields, the JSON structure will be displayed below. You can edit or delete fields as needed.
                            </li>
                            <li>
                                <strong>Submit JSON:</strong> When you're satisfied with your JSON structure, click "Submit JSON" to finalize it.
                            </li>
                        </ol>
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
                    <div className="json-output">
                        <h2>Generated JSON:</h2>
                        <div>{renderJsonFields(jsonData)}</div>
                    </div>
                    <div className="json-output">
                        <pre>{JSON.stringify(jsonData, null, 2)}</pre>
                    </div>
                    <button onClick={handleSubmit} className="submit-button">Submit JSON</button>
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
        </div>
    );
}

export default CreateFile;
