import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const checkHealth = async () => {
    try {
        const response = await api.get('/health');
        return response.data;
    } catch (error) {
        console.error('API Health Check Failed:', error);
        return null;
    }
};

export const predictDiabetes = async (data) => {
    const response = await api.post('/predict/diabetes', data);
    return response.data;
};

export const predictHeart = async (data) => {
    const response = await api.post('/predict/heart', data);
    return response.data;
};

export const predictParkinsons = async (data) => {
    const response = await api.post('/predict/parkinsons', data);
    return response.data;
};

export const generateReport = async (disease, data, prediction, probability) => {
    // Determine endpoint based on disease
    let endpoint = '';
    if (disease.toLowerCase() === 'diabetes') endpoint = '/report/diabetes';
    else if (disease.toLowerCase().includes('heart')) endpoint = '/report/heart';
    else if (disease.toLowerCase().includes('parkinson')) endpoint = '/report/parkinsons';

    if (!endpoint) throw new Error('Unknown disease type');

    const response = await api.post(endpoint, {
        ...data,
    }, {
        params: { prediction, probability },
        responseType: 'blob'
    });
    return response.data;
};

export const getHistory = async () => {
    const response = await api.get('/history');
    return response.data;
};

export const getStats = async () => {
    const response = await api.get('/stats');
    return response.data;
};

export default api;
