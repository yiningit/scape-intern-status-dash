// Centralises all HTTP calls for services, keeps endpoints and HTTP details out of hooks.

import { AXIOS } from './axios.js';

export const fetchAllServices = async () => {
    const res = await AXIOS.get('/services');
    return res.data ?? [];
};

export const resetToDefaults = async () => {
    const res = await AXIOS.post('/services/reset-to-defaults');
    return res?.data?.services ?? [];
};

export const createService = async (payload) => {
    const res = await AXIOS.post('/services', payload);
    return res.data;
};

export const deleteServiceById = async (id) => {
    await AXIOS.delete(`/services/${id}`);
}