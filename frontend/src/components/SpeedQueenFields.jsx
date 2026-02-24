import { useRef } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import DialogContentText from '@mui/material/DialogContentText';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

// import {
//     AXIOS_SQ_LOGIN,
//     AXIOS_SQ_BUILDINGS,
//     setHeaderForBuildings,
//     AXIOS_SQ_ROOMS,
//     setHeaderForRooms,
//     AXIOS_SQ_STATUSES,
//     setHeaderForStatuses,
// } from '../api/axios';

// import { buildOrganisationsUrl, buildRoomsUrl, buildStatusUrl } from '../api/speedQueenUrls';
import { useSpeedQueenAuth } from '../hooks/useSpeedQueenAuth';
import { useSpeedQueenLocations } from '../hooks/useSpeedQueenLocations';
import { useSpeedQueenMachinesStatus } from '../hooks/useSpeedQueenMachinesStatus';

function LoginAlert ({loginState, loginMessage}) {
    const SEVERITY_MAP = {
        fetching: {
            severity: 'info',
            icon: <CircularProgress size={20} color="inherit" />,
        },
        valid: {
            severity: 'success',
            icon: <CheckIcon fontSize="inherit" color="inherit" />,
        },
        invalid: {
            severity: 'error',
            icon: <ClearIcon fontSize="inherit" color="inherit" />
        },
    };
    const config = SEVERITY_MAP[loginState];

    return (
        <Alert severity={config.severity} icon={config.icon} sx={{ mt: 1 }}>
            {loginMessage ?? 'Error: no login message provided.'}
        </Alert>
    )
};

function MachinesAlert ({isFetchingStatus, statusError, machinesState, machinesStatus, newSvcName}) {
    const SEVERITY_MAP = {
        fetching: {
            severity: 'info',
            icon: <CircularProgress size={20} color="inherit" />,
            message: "Fetching machine statuses...",
        },
        failed: {
            severity: 'error',
            icon: undefined,
            message: statusError,
        },
        up: {
            severity: 'success',
            icon: <CheckIcon fontSize="inherit" color="inherit" />,
            message: `${newSvcName}: ${machinesStatus}`,
        },
        down: {
            severity: 'error',
            icon: <ClearIcon fontSize="inherit" color="inherit" />,
            message: `${newSvcName}: ${machinesStatus}`,
        },
    };

    let config;
    if (isFetchingStatus) {
        config = SEVERITY_MAP['fetching'];
    } else if (statusError) {
        config = SEVERITY_MAP['failed'];
    } else if (machinesState) {
        config = SEVERITY_MAP['up'];
    } else {
        config = SEVERITY_MAP['down'];
    }

    return (
        <Alert variant="outlined" severity={config.severity} icon={config.icon} sx={{ mt: 1 }}>
            {config.message}
        </Alert>
    )
}

export default function SpeedQueenFields({
    // Field values and setters
    newSvcName,
    setNewSvcName,
    setNewSvcUrl,
    newSvcToken,
    setNewSvcToken,
    newUserId,
    setNewUserId,

    // Event handlers
    onEnterFocusNext,    

}) {
    // Refs for focusing in special Enter key behaviour
    const emailRef = useRef(null);
    const passRef = useRef(null);    

    // ADD SHOW/HIDE PASSWORD FUNCTIONALITY

    // Request handlers
    const {
        loginEmail,
        setLoginEmail,
        loginPass,
        setLoginPass,
        loginState,
        loginMessage,
        attemptLoginOnBlur,
    } = useSpeedQueenAuth({ setNewSvcToken, setNewUserId });

    const {
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
    } = useSpeedQueenLocations({ newUserId, newSvcToken });

    const {
        isFetchingStatus,
        statusError,
        machinesState,
        machinesStatus,
    } = useSpeedQueenMachinesStatus({
        newSvcToken,
        roomId,
        newSvcName,
        setNewSvcUrl,
    });


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
            {(isFetchingStatus || machinesState !== null) && (
                <MachinesAlert
                    isFetchingStatus={isFetchingStatus}
                    statusError={statusError}
                    machinesState={machinesState}
                    machinesStatus={machinesStatus}
                    newSvcName={newSvcName}
                />
            )}            
        </>
    );
}