import React, { useEffect, useState } from 'react';
import '../styles/viewFiles.css';
import { useNavigate } from 'react-router-dom';
import { callApi } from '../common/apiUtils';

function ViewFiles() {
    const navigate = useNavigate();
    const [races, setRaces] = useState([]);
    const [filteredRaces, setFilteredRaces] = useState([]);
    const [carModelFilter, setCarModelFilter] = useState('');
    const [carNameFilter, setCarNameFilter] = useState('');
    const [raceSeasonFilter, setRaceSeasonFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 2;

    // Fetch the race data
    useEffect(() => {
        const token = sessionStorage.getItem('accessToken');
        const fetchRaces = async () => {
            try {
                const response = await fetch('http://localhost:5555/all/races', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setRaces(data);
                setFilteredRaces(data); // Initially set filteredRaces to the full data
            } catch (error) {
                console.error('Error fetching races:', error);
            }
        };

        fetchRaces();
    }, []);

    // Handle filtering
    useEffect(() => {
        const filtered = races.filter(race => {
            return (
                (carModelFilter === '' || race.car_model.toLowerCase().includes(carModelFilter.toLowerCase())) &&
                (carNameFilter === '' || race.car_name.toLowerCase().includes(carNameFilter.toLowerCase())) &&
                (raceSeasonFilter === '' || race.race_season.includes(raceSeasonFilter))
            );
        });
        setFilteredRaces(filtered);
        setCurrentPage(1); // Reset to first page after filtering
    }, [carModelFilter, carNameFilter, raceSeasonFilter, races]);

    // Handle pagination
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRaces = filteredRaces.slice(indexOfFirstRow, indexOfLastRow);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleEdit = async (race) => {
        const token = sessionStorage.getItem('accessToken'); // Get the token for authorization


        try {
            const response = await fetch(`http://localhost:5555/race/${race.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Add Authorization header if needed
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Add the new key-value pair "method: EDITFILE" to the data object
            data.method = "EDITFILE";

            // console.log(data.json_data); // Log the API response data in the console

            // Navigate to EditJson component and pass data.json_data as state
            navigate('/edit-json', { state: { data: data.json_data, fileDetails: data } });
        } catch (error) {
            console.error('Error fetching race data:', error); // Log any errors
        }
    };

    // Reset filters
    const handleResetFilters = () => {
        setCarModelFilter('');
        setCarNameFilter('');
        setRaceSeasonFilter('');
    };

    return (
        <div className="view-files-container">
            <div className="back-button-container">
                <button className="backButton point" onClick={() => navigate('/home')}>
                    <i className="fa-solid fa-arrow-left-long "></i> &nbsp; Back to home
                </button>
            </div>
            <h2>Files List</h2>

            {/* Filter Inputs */}
            <div className="filters">
                <button className="reset-button" onClick={handleResetFilters}>
                    Reset Filters
                </button>
                <input
                    type="text"
                    placeholder="Filter by Car Model"
                    value={carModelFilter}
                    className='filters'
                    onChange={(e) => setCarModelFilter(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Filter by Car Name"
                    className='filters'
                    value={carNameFilter}
                    onChange={(e) => setCarNameFilter(e.target.value)}
                />
                <input
                    type="date"
                    className='filters'
                    placeholder="Filter by Race Season"
                    value={raceSeasonFilter}
                    onChange={(e) => setRaceSeasonFilter(e.target.value)}
                />
            </div>

            {/* Race Data Table */}
            <table>
                <thead>
                    <tr>
                        <th scope="col">Race Season</th>
                        <th scope="col">Car Model</th>
                        <th scope="col">Car Name</th>
                        <th scope="col">Edit File</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRaces.map((race, index) => (
                        <tr key={race.id}>
                            <td>{race.race_season}</td>
                            <td>{race.car_model}</td>
                            <td>{race.car_name}</td>
                            <td>
                                <button className='edit-button' onClick={() => handleEdit(race)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
                {Array.from({ length: Math.ceil(filteredRaces.length / rowsPerPage) }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default ViewFiles;
