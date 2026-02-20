import { useState, useEffect, useRef, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import DialogContentText from '@mui/material/DialogContentText';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import {
    AXIOS_SQ_LOGIN,
    AXIOS_SQ_BUILDINGS,
    setHeaderForBuildings,
    AXIOS_SQ_ROOMS,
    setHeaderForRooms,
    AXIOS_SQ_STATUSES,
    setHeaderForStatuses,
} from '../api/axios';

import { computeSpeedQueenStatus } from '../utils/status/sqStatus';


function LoginAlert ({loginState, loginMessage}) {
    const SEVERITY_MAP = {
        fetching: {severity: 'info'},
        valid: {severity: 'success'},
        invalid: {severity: 'error'},
    }
    const config = SEVERITY_MAP[loginState];

    return (
        <Alert severity={config.severity}  sx={{ mt: 1 }}>
            {loginMessage ?? 'Error: no login message provided.'}
        </Alert>
    )
};

export default function SpeedQueenFields({
    // Field values and setters
    newSvcName,
    setNewSvcName,
    setNewSvcUrl,
    newSvcToken,
    setNewSvcToken,
    newUserId,
    setNewUserId,
    newOrgId,
    setNewOrgId,

    // Event handlers
    onEnterFocusNext,    

}) {
    // Local states for login verification
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPass, setLoginPass] = useState('');

    // Local states for locating rooms
    const [roomId, setRoomId] = useState('');

    // UI states
    const [showPassword, setShowPassword] = useState(false);   // ADD SHOW/HIDE PASSWORD FUNCTIONALITY

    const [loginState, setLoginState] = useState(null);
    const [loginMessage, setLoginMessage] = useState('');

    const [buildingError, setBuildingError] = useState('');
    const [isFetchingBuilding, setIsFetchingBuilding] = useState(false);
    const [buildings, setBuildings] = useState([]);

    const [roomError, setRoomError] = useState('');
    const [isFetchingRoom, setIsFetchingRoom] = useState(false);
    const [rooms, setRooms] = useState([]);

    const [isFetchingStatus, setIsFetchingStatus] = useState(false);
    const [statusError, setStatusError] = useState('');
    const [machinesState, setMachinesState] = useState(null);
    const [machinesStatus, setMachinesStatus] = useState('');

    // Refs for focusing in special Enter key behaviour
    const emailRef = useRef(null);
    const passRef = useRef(null);    

    // ADD SHOW/HIDE PASSWORD FUNCTIONALITY

    // Build URLs for GET requests
    // Build GET URL for available buildings/organisations
    const buildOrganisationsUrl = useCallback(() => {
        if (!newUserId) return;
        const orgs_url = `https://platform.sqinsights.com/users/${newUserId}/organizations`;
        return orgs_url;
    }, [newUserId]);

    // Build GET URL for building's rooms
    const buildRoomsUrl = useCallback(() => {
        if (!newOrgId) return;
        const rooms_url = `https://platform.sqinsights.com/paywall/organizations/${newOrgId}/locations`;
        return rooms_url;
    }, [newOrgId]);

    // Build GET URL for machine statuses
    const buildStatusUrl = useCallback(() => {
        if (!roomId) return;
        const status_url = `https://api.sqinsights.com/rooms/${roomId}/machines?roomId=${roomId}`;
        return status_url;
    }, [roomId]);


    // Request handlers
    // POST to login url to get authToken
    const handleLoginForToken = useCallback(async () => {
        setLoginMessage("Verifying login details...");
        setLoginState('fetching');

        // Basic client-side validation
        const email = (loginEmail || '').trim();
        const password = (loginPass || '').trim();

        if (!email || !password) {
            setLoginState('invalid');
            setLoginMessage("Please enter both email and password.");
            return;
        }

        try {
            const loginRes = await AXIOS_SQ_LOGIN.post('/auth/login', { email, password });
            
            // Extract token and user ID
            const data = loginRes?.data ?? {};
            const token = data.meta.authToken ?? null;
            if (!token) {
                const msg = typeof data === 'object' ? JSON.stringify(data) : String(data || '');
                setLoginState('invalid');
                setLoginMessage(`Login succeeded but no auth token found. Body: ${msg}`);
            }
            const user_id = data.data.id ?? null;
            if (!user_id) {
                const msg = typeof data === 'object' ? JSON.stringify(data) : String(data || '');
                setLoginState('invalid');
                setLoginMessage(`Login succeeded but no user ID found. Body: ${msg}`);
            }

            // Save token and set login alert message
            setNewSvcToken(token);
            setNewUserId(user_id);
            setLoginState('valid');
            setLoginMessage('Authentication token retrieved successfully.');
        } catch (err) {
            const status = err?.response?.status;
            const errMsg = err?.message;

            // Catch invalid login details error
            if (status === 400 || status === 401 || status === 403) {
                setLoginState('invalid');
                setLoginMessage('Invalid login details.');
            } else {
                setLoginState('invalid');
                setLoginMessage(errMsg || `Failed with code ${status}.` || 'Network/server error. Please try again.');
            }
        }
    }, [loginEmail, loginPass, setNewSvcToken, setNewUserId]);

    // GET to organisations URL to get available buildings
    const getBuildings = useCallback(async () => {
        setBuildingError('');

        if (!newUserId) return;

        // Require token before calling endpoint
        if (!newSvcToken) {
            setBuildingError('Could not find authentication token.');
            return;
        }

        // Build URL for available buildings using user ID
        const buildingsUrl = buildOrganisationsUrl();

        setNewOrgId('');
        setRoomId('');
        setBuildings([]);
        setRooms([]);
        setBuildingError('');
        setRoomError('');
        setIsFetchingBuilding(true);
        try {
            setHeaderForBuildings(newSvcToken);
            const buildingsRes = await AXIOS_SQ_BUILDINGS.get(buildingsUrl);
            const json = buildingsRes?.data ?? {};

            // Extract building names and IDs
            try {
                const buildingNames = json.map(b => ({
                    id: b.id,
                    name: b.name ?? 'Error: Failed to find property name',
                }));
                setBuildings(buildingNames);
            } catch {
                throw new Error('Failed to load properties', err);
            }
        } catch (err) {
            const status = err?.response?.status;
            const data = err?.response?.data;

            const serverMsg = (data && typeof data === 'object' && data.message) || (typeof data === 'string' ? data : '');
            setBuildingError(
                serverMsg || (status === 400 || status === 401 || status === 403
                    ? 'Invalid or unauthorized request.'
                    : `Request failed with status code ${status}.`)
                );
        } finally {
            setIsFetchingBuilding(false);
        }
    }, [buildOrganisationsUrl, newSvcToken, newUserId]);
    // After login (token + user ID), fetch buildings
    useEffect(() => {
        setNewOrgId('');
        setRoomId('');
        if (newSvcToken && newUserId) getBuildings();
    }, [newSvcToken, newUserId, getBuildings]);

    // GET to locations URL to get building's rooms
    const getRooms = useCallback(async () => {
        setRoomError('');

        // Require token before calling endpoint
        if (!newSvcToken) {
            setRoomError('Could not find authentication token.');
            return;
        }

        // Build URL for building's rooms using organisation ID
        const roomsUrl = buildRoomsUrl();

        setRoomId('');
        setRooms([]);
        setIsFetchingRoom(true);

        try {
            setHeaderForRooms(newSvcToken);
            const roomsRes = await AXIOS_SQ_ROOMS.get(roomsUrl);
            const locations = roomsRes?.data?.locations ?? {};

            // Extract room names and IDs
            try {
                const roomNames = locations.map((r) => ({
                    id: r.id,
                    name: r.name ?? 'Error: Failed to find room name',
                }));
                setRooms(roomNames);
                setRoomError('');
            } catch {
                throw new Error('Failed to load rooms', err);
            }

            
        } catch (err) {
            const status = err?.response?.status;
            const data = err?.response?.data;

            const serverMsg = (data && typeof data === 'object' && data.message) || (typeof data === 'string' ? data : '');
            setRoomError(
                serverMsg || (status === 400 || status === 401 || status === 403
                    ? 'Invalid or unauthorized request.'
                    : `Request failed with status code ${status}.`)
                );
        } finally {
            setIsFetchingRoom(false);
        }
    }, [buildRoomsUrl, newSvcToken, newOrgId]);
    // After selecting a building, fetch rooms
    useEffect(() => {
        setRoomId('');

        if (newSvcToken && newOrgId) {
            getRooms();
        }
    }, [newSvcToken, newOrgId, getRooms]);

    // GET to machines URL to get machine statuses
    const getMachinesStatus = useCallback(async () => {
        setStatusError('');
        setMachinesState('');
        setMachinesStatus('');

        if (!roomId) return;

        if (!newSvcToken) {
            setStatusError('Could not find authentication token.');
            return;
        }

        const statusUrl = buildStatusUrl();
        setIsFetchingStatus(true);

        try {
            setHeaderForStatuses(newSvcToken);

            const statusRes = await AXIOS_SQ_STATUSES.get(statusUrl);

            // Adapt repsonse to util format (Promise.allSettled style result)
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
            const fakeSettledResult = {
                status: "rejected",
                reason: err
            };

            const computed = computeSpeedQueenStatus(fakeSettledResult, {
                _id: null,
                service: newSvcName || "SpeedQueen"
            });

            setMachinesState(false);
            setMachinesStatus(computed.status);

            const status = err?.response?.status;
            const data = err?.response?.data;

            const serverMsg =
                (data && typeof data === 'object' && data.message) ||
                (typeof data === 'string' ? data : '');

            setStatusError(
                serverMsg ||
                (status === 400 || status === 401 || status === 403
                    ? 'Invalid or unauthorized request.'
                    : `Request failed with status code ${status}`)
            );
        } finally {
            setIsFetchingStatus(false);
        }
    }, [buildStatusUrl, newSvcToken, roomId, setNewSvcUrl, newSvcName]);    // After selecting a room, fetch machine status
    useEffect(() => {
        if (newSvcToken && roomId) {
            getMachinesStatus();
        }
    }, [newSvcToken, roomId, getMachinesStatus]);


    // Selector handlers
    const handleBuildingSelect = (e) => {
        setNewOrgId(e.target.value);
        
        // Clear rooms & room selection on building change
        setRooms([]);
        setRoomId('');
        setRoomError('');
    };

    const handleRoomSelect = (e) => {
        const room_id = e.target.value;
        setRoomId(room_id);

        const room_obj = rooms.find(r => String(r.id) === String(room_id));
        setNewSvcName(room_obj ? room_obj.name : null);
    }

    // Request login on blur of login details
    const isSubmittingRef = useRef(false);
    const lastSubmittedRef = useRef({ email: '', pass: '' });
    const attemptLoginOnBlur = useCallback(async () => {
        const email = (loginEmail || '').trim();
        const pass = (loginPass || '').trim();

        // Only proceed if both fields have something
        if (!email || !pass) return;

        // Avoid duplicate submits for same credentials
        const sameAsLast =
            lastSubmittedRef.current.email === email &&
            lastSubmittedRef.current.pass === pass;

        if (isSubmittingRef.current || sameAsLast) return;

        isSubmittingRef.current = true;
        try {
            // Reset before re-auth
            setNewSvcToken('');
            setNewUserId('');

            // Perform login
            await handleLoginForToken();
            // Remember what we just submitted
            lastSubmittedRef.current = { email, pass };
        } finally {
            isSubmittingRef.current = false;
        }
    }, [loginEmail, loginPass, handleLoginForToken, setNewSvcToken, setNewUserId]);

    
    return (
        <>
            <Box sx={{ my: 2 }}>
                <DialogContentText>Enter SpeedQueen login details:</DialogContentText>
                <TextField
                    id="login-email"
                    label="Email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    onBlur={attemptLoginOnBlur}
                    autoFocus
                    required
                    fullWidth
                    size="small"
                    margin="dense"
                    inputRef={emailRef}
                    onKeyDown={(e) => {onEnterFocusNext(e, passRef)}}
                />

                <TextField
                    id="login-password"
                    label="Password"
                    type="password"   // ADD SHOW/HIDE PASSWORD FUNCTIONALITY
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    onBlur={attemptLoginOnBlur}
                    required
                    fullWidth
                    size="small"
                    margin="dense"
                    inputRef={passRef}
                    onKeyDown={async (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            e.stopPropagation();
                            await attemptLoginOnBlur();   // trigger login
                        }
                    }}
                />
                {loginState && (
                    <LoginAlert loginState={loginState} loginMessage={loginMessage}/>
                )}
            </Box>


            <DialogContentText sx={{ mt: 1 }}>Select laundry room:</DialogContentText>
            {/* Buidling/organisation selector */}
            <Box>
                <FormControl fullWidth size="small" margin="dense" required error={!!buildingError}>
                    <InputLabel id="building-label">
                        {isFetchingBuilding ? "Loading properties..." : (!!buildingError ? buildingError : "Choose property:")}
                    </InputLabel>
                    <Select
                        labelId="building-label"
                        id="building"
                        label="Choose property:"
                        value={newOrgId}
                        onChange={handleBuildingSelect}
                        disabled={isFetchingBuilding || !(newSvcToken && newUserId) || !!buildingError}
                    >
                        {buildings.map((b) => (
                            <MenuItem key={b.id} value={b.id}>
                                {b.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Room selector */}
            <Box>
                <FormControl fullWidth size="small" margin="dense" required error={!!roomError}>
                    <InputLabel id="room-label">
                        {isFetchingRoom ? "Loading room..." : (!!roomError ? roomError : "Choose room:")}
                    </InputLabel>
                    <Select
                        labelId="room-label"
                        id="room"
                        label="Choose room:"
                        value={roomId}
                        onChange={handleRoomSelect}
                        disabled={isFetchingRoom || !newOrgId || !!roomError}
                    >
                        {rooms.map((r) => (
                            <MenuItem key={r.id} value={r.id}>
                                {r.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Machines status preview */}
            <Box sx={{ mt: 1 }}>
                {machinesState ? (
                    <Alert variant="outlined" icon={<CheckIcon fontSize="inherit" />} severity="success">
                        {newSvcName}: {machinesStatus}
                    </Alert>
                ) : (machinesState === false) ? (
                    <Alert variant="outlined" icon={<ClearIcon fontSize="inherit" />} severity="error">
                        {newSvcName}: {machinesStatus}
                    </Alert>
                ) : null}
            </Box>
        </>
    );
}