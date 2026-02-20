// Handles general domain logic: handles CRUD with database, references loading state for auto-refresh

import { useEffect, useRef, useState, useCallback } from 'react';
import { AXIOS_MANUAL, AXIOS_SQ_STATUSES, setHeaderForStatuses } from '../api/axios.js';
import { 
    fetchAllServices, 
    resetToDefaults as apiResetToDefaults, 
    createService as apiCreateService, 
    deleteServiceById 
} from '../api/services.js';

import { computeManualStatus } from '../utils/status/manualStatus.js';
import { computeSpeedQueenStatus } from '../utils/status/sqStatus.js';


export function useServices() {
    const [allServices, setAllServices] = useState([]);   // contains service data for fetch
    const [services, setServices] = useState([]);   // contains service data for render
    const [lastUpdated, setLastUpdated] = useState('');
    const [loading, setLoading] = useState(false);

    // Take reference of loading state for auto-refresh
    const loadingRef = useRef(loading);
    const lastLoadAtRef = useRef(0);
    useEffect(() => { loadingRef.current = loading }, [loading]);   // update whenever loading changes

    // Initial fetch of services from database
    useEffect(() => {
        (async () => {
            try {
                const urls = await fetchAllServices();
                setAllServices(urls);
            } catch (err) {
                console.error('Failed to fetch services from API', err);
            }
            })();
    }, []);

    const load = useCallback(async () => {
        const all = allServices;

        // Prevent concurrent loads
        if (loadingRef.current) return;
        setLoading(true);

        try {
            // Fetch from URLs
            const responses = await Promise.allSettled(
                all.map(svc => {
                    switch (svc.type) {
                        case 'manual':
                            return AXIOS_MANUAL.get(svc.url).then(res => ({ service: svc.service, data: res.data }));
                        case 'speedqueen':
                            setHeaderForStatuses(svc.data.token, svc.data.org_id)
                            return AXIOS_SQ_STATUSES.get(svc.url).then(res => ({ service: svc.service, data: res.data }));
                        default:
                            return Promise.resolve({ service: svc.service, data: null });
                    }
                })
            );

            // Extract service statuses
            const entries = responses.map((result, index) => {
            const def = all[index];

            if (!def) return null;

            switch (def.type) {
                case "manual":
                    return computeManualStatus(result, def);

                case "speedqueen":
                    return computeSpeedQueenStatus(result, def);

                default:
                    return {
                        id: def._id,
                        service: def.service,
                        status: "Unsupported service type",
                        state: "error",
                    };
                }
            }).filter(Boolean);

            // Apply updated statuses and time of update
            setServices(entries);
            setLastUpdated(new Date().toLocaleString());
            lastLoadAtRef.current = Date.now();
        } catch (e) {
            console.error(e);
            setLastUpdated(`Failed with "${e}" at ${new Date().toLocaleString()}`);
        } finally {
            setLoading(false);
        }
    }, [allServices]);

    // Expose helpers for auto-refresh hook
    const getLastLoadAt = useCallback(() => lastLoadAtRef.current, []);
    const isLoading = useCallback(() => loadingRef.current, []);   // gets latest value through callback of a ref

    // CRUD actions
    const resetToDefaults = useCallback(async () => {
        const defaults = await apiResetToDefaults();
        setAllServices(defaults);
    }, []);

    const addService = useCallback(async ({ service, url, type, data }) => {
        // Prevent duplicates by name (case-insensitive)
        const exists = allServices.some(
            s => s.service.toLowerCase() === service.toLowerCase()
        );
        if (exists) {
            const err = new Error("A service with this name already exists.");
            err.code = 'DUPLICATE';
            throw err;
        }
        const created = await apiCreateService({ service, url, type, data });
        setAllServices(prev => [...prev, created]);
        return created;
    }, [allServices]);

    const deleteService = useCallback(async (serviceName) => {
        // Find by name to get _id for database
        const svc = allServices.find(s => s.service === serviceName);
        if (!svc) {
            // Service only exists in memory: remove from UI
            setServices(prev => prev.filter(s => s.service !== serviceName));
            setAllServices(prev => prev.filter(s => s.service !== serviceName));
            return;
        }

        // Service exists in backend and in memory: remove from both
        await deleteServiceById(svc._id);
        setServices(prev => prev.filter(s => s.service !== serviceName));
        setAllServices(prev => prev.filter(s => s._id !== svc._id));
    }, [allServices]);


    return {
        // State
        services,
        lastUpdated,
        loading,

        // Actions
        load,
        resetToDefaults,
        addService,
        deleteService,

        // Auto-refresh
        getLastLoadAt,
        isLoading,
    };
}