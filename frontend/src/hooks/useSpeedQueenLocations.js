import { useState, useEffect, useCallback } from 'react';
import {
    AXIOS_SQ_BUILDINGS,
    AXIOS_SQ_ROOMS,
    setHeaderForBuildings,
    setHeaderForRooms,
} from '../api/axios';
import {
    buildOrganisationsUrl,
    buildRoomsUrl,
} from '../api/speedQueenUrls';

export function useSpeedQueenLocations({ newUserId, newSvcToken }) {
    const [buildings, setBuildings] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [newOrgId, setNewOrgId] = useState('');
    const [roomId, setRoomId] = useState('');

    const [buildingError, setBuildingError] = useState('');
    const [roomError, setRoomError] = useState('');

    const [isFetchingBuilding, setIsFetchingBuilding] = useState(false);
    const [isFetchingRoom, setIsFetchingRoom] = useState(false);

    // GET to organisations URL to get available buildings
    const getBuildings = useCallback(async () => {
        // Only proceed if user ID and authToken are present
        if (!newUserId || !newSvcToken) return;

        setBuildings([]);
        setRooms([]);
        setNewOrgId('');
        setRoomId('');
        setBuildingError('');
        setRoomError('');
        setIsFetchingBuilding(true);

        try {
            setHeaderForBuildings(newSvcToken);
            const res = await AXIOS_SQ_BUILDINGS.get(buildOrganisationsUrl(newUserId));

            const data = res?.data ?? [];

            // Extract building names and IDs
            setBuildings(
                data.map(b => ({
                    id: b.id,
                    name: b.name ?? 'Unknown property',
                }))
            );
        } catch {
            setBuildingError('Failed to load properties.');
        } finally {
            setIsFetchingBuilding(false);
        }
    }, [newUserId, newSvcToken]);

    // After login (token + user ID), fetch buildings
    useEffect(() => {
        if (newUserId && newSvcToken) getBuildings();
    }, [newUserId, newSvcToken, getBuildings]);

    // GET to locations URL to get building's rooms
    const getRooms = useCallback(async () => {
        // Require building ID and authToken before proceeding
        if (!newOrgId || !newSvcToken) return;

        setRooms([]);
        setRoomId('');
        setRoomError('');
        setIsFetchingRoom(true);

        try {
            setHeaderForRooms(newSvcToken);
            const res = await AXIOS_SQ_ROOMS.get(buildRoomsUrl(newOrgId));

            const locations = res?.data?.locations ?? [];

            // Extract room names and IDs
            setRooms(
                locations.map(r => ({
                    id: r.id,
                    name: r.name ?? 'Unknown room',
                }))
            );
        } catch {
            setRoomError('Failed to load rooms.');
        } finally {
            setIsFetchingRoom(false);
        }
    }, [newOrgId, newSvcToken]);

    // After selecting a building, fetch rooms
    useEffect(() => {
        if (newOrgId && newSvcToken) getRooms();
    }, [newOrgId, newSvcToken, getRooms]);

    return {
        buildings,
        rooms,
        newOrgId,
        setNewOrgId,
        roomId,
        setRoomId,
        buildingError,
        roomError,
        isFetchingBuilding,
        isFetchingRoom,
    };
}