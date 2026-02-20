const KEY = 'allServices';

export function loadAllServices() {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function saveAllServices(services) {
    try {
        localStorage.setItem(KEY, JSON.stringify(services));
    } catch(e) {
        // Swallow errors to avoid breaking UI if storage is unavailable
        console.log(e)
    }
}