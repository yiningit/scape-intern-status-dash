// Handles auto-refresh functionality

import { useEffect } from 'react';

export function useAutoRefresh({ load, getLastLoadAt, isLoading }) {
    useEffect(() => {
        // Initial load on mount
        load();

        const VISIBLE_MS = 60 * 1000;   // 1 minute when tab is visible
        const HIDDEN_MS  = 5 * 60 * 1000;   // 5 minutes when tab is hidden
        
        let timerId;

        // Get delay based on visibility
        const getDelay = () =>
        document.visibilityState === 'visible' ? VISIBLE_MS : HIDDEN_MS;
        
        // Reload whenever delay elapses
        const schedule = () => {
            clearInterval(timerId);   // stops the timer started by setInterval()
            timerId = setInterval(() => {
                if (!isLoading) {
                    load()
                }
            }, getDelay())
        };

        // (Re)configure schedule whenever visibility changes
        const onVisibilityChange = () => {
        // Refresh immediately if tab becomes visible and VISIBLE_MS has elapsed
        if (
            document.visibilityState === 'visible' &&
            Date.now() - getLastLoadAt >= VISIBLE_MS &&
            !isLoading
        ) {
            load()
        }
        schedule()
        };

        // Start the interval
        schedule();
        document.addEventListener('visibilitychange', onVisibilityChange);

        // Cleanup when component unmounts / before effect reruns
        return () => {
            clearInterval(timerId);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, [load, getLastLoadAt, isLoading]);
}