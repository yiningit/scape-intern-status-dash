import axios from 'axios';

// Handles connections to internal database (MongoDB Atlas)
export const AXIOS = axios.create({
    baseURL: import.meta.env?.VITE_API_BASE || 'http://localhost:5000/api',
    timeout: 8_000,   // 8s
    headers: {'Accept': 'application/json'}
});

// Handles fetches from external status APIs
export const AXIOS_MANUAL = axios.create({
    timeout: 8_000,   // 8s
    headers: {'Accept': 'application/json'}
});

// SpeedQueen
const SQ_API_URL = 'https://api.sqinsights.com';
const SQ_PLATF_URL = 'https://platform.sqinsights.com';
const defaultApiHeaders = {
    Accept: 'application/vnd.api+json, text/javascript, */*; q=0.01',
    'Content-Type': 'application/json',
    app: 'INSIGHTS',
    'x-api-key': '4da79517795f579f1717d55b25fb1e9d',   // SHOULD THIS BE HARDCODED??
}
const defaultPlatfHeaders = {
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'Content-Type': 'application/json', // optional for GET
    app: 'INSIGHTS',
}
// Handles POST request to SpeedQueen login
export const AXIOS_SQ_LOGIN = axios.create({
    baseURL: SQ_API_URL,
    headers: {
        ...defaultApiHeaders,
    },
    withCredentials: false,
    timeout: 20000,
});

// Handles GET request for available buildings
export const AXIOS_SQ_BUILDINGS = axios.create({
    baseURL: SQ_API_URL,
    headers: {
        ...defaultApiHeaders,
    },
    withCredentials: false,
    timeout: 20000,
});
export function setHeaderForBuildings(token) {
    AXIOS_SQ_BUILDINGS.defaults.headers.Authorization = `Bearer ${token}`;
}

// Handles GET request for building's rooms
export const AXIOS_SQ_ROOMS = axios.create({
    baseURL: SQ_PLATF_URL,
    headers: {
        ...defaultPlatfHeaders,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
    },
    withCredentials: false,
    timeout: 20000,
});
export function setHeaderForRooms(token) {
    AXIOS_SQ_ROOMS.defaults.headers.Authorization = `Bearer ${token}`;
}

// Handles GET request for room's machines statuses
export const AXIOS_SQ_STATUSES = axios.create({
    baseURL: SQ_API_URL,
    headers: {
        ...defaultApiHeaders,
    },
    withCredentials: false,
    timeout: 20000,
});
export function setHeaderForStatuses(token, orgId) {
    AXIOS_SQ_STATUSES.defaults.headers['alliancels-auth-token'] = token;
    AXIOS_SQ_STATUSES.defaults.headers['alliancels-organization-id'] = orgId;
};