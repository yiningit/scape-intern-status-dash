import { useState, useEffect, useCallback } from 'react';
import {
    AXIOS_SQ_STATUSES,
    setHeaderForStatuses,
} from '../api/axios';
import { buildStatusUrl } from '../api/speedQueenUrls';
import { computeSpeedQueenStatus } from '../utils/status/sqStatus';

export function useSpeedQueenMachinesStatus({
    newSvcToken,
    roomId,
    newSvcName,
    setNewSvcUrl,
}) {
    const [isFetchingStatus, setIsFetchingStatus] = useState(false);
    const [statusError, setStatusError] = useState('');
    const [machinesState, setMachinesState] = useState(null);
    const [machinesStatus, setMachinesStatus] = useState('');

    // GET to machines URL to get machine statuses
    const getMachinesStatus = useCallback(async () => {
        if (!newSvcToken || !roomId) return;

        const statusUrl = buildStatusUrl(roomId);
        setIsFetchingStatus(true);

        try {
            setHeaderForStatuses(newSvcToken);
            const statusRes = await AXIOS_SQ_STATUSES.get(statusUrl);

            // Adapt response to util format (Promise allSettled style result)
            const fakeSettledResult = {
                status: "fulfilled",
                value: { data: statusRes?.data }
            };

            const computed = computeSpeedQueenStatus(fakeSettledResult, {
                _id: null,
                service: newSvcName || "SpeedQueen"
            });

            setMachinesState(computed.state === 'up');
            setMachinesStatus(computed.status);
            setNewSvcUrl(statusUrl);

        } catch (err) {
            setStatusError('Failed to fetch machine status.');
        } finally {
            setIsFetchingStatus(false);
        }
    }, [newSvcToken, roomId, newSvcName, setNewSvcUrl]);

    // After selecting a room, fetch machine status
    useEffect(() => {
        if (newSvcToken && roomId) getMachinesStatus();
    }, [newSvcToken, roomId, getMachinesStatus]);

    return {
        isFetchingStatus,
        statusError,
        machinesState,
        machinesStatus,
    };
}