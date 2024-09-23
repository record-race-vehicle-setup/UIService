// apiUtils.js

export const callApi = async (url, payload = null, method = 'POST') => {
    try {
        const token = sessionStorage.getItem('accessToken'); // Get token from sessionStorage
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }), // Add token to headers if available
        };

        const response = await fetch(url, {
            method,
            headers,
            body: payload ? JSON.stringify(payload) : null, // Only include body for POST requests
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong!');
        }
        return data;
    } catch (error) {
        // console.error('API call failed:', error.message);
        // alert(error.message);
        return null;
    }
};
