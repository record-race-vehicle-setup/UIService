// apiUtils.js

export const BASE_URL = 'http://localhost:5555';  // Define the base URL

export const callApi = async (endpoint, payload = null, method = 'POST') => {
    try {
        const token = sessionStorage.getItem('accessToken');  // Get token from sessionStorage if needed

        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),  // Add token to headers if available
        };

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method,
            headers,
            body: payload ? JSON.stringify(payload) : null,  // Include body for POST requests
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong!');
        }
        return data;
    } catch (error) {
        // console.error('API call failed:', error.message);
        return null;
    }
};
