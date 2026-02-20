import { useState, useRef, useCallback, useEffect } from 'react';
import { handleFormEnter, onEnterFocusNext } from '../utils/focusOnEnter.js';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Alert from '@mui/material/Alert';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// Component imports
import ManualEntryFields from './ManualEntryFields.jsx';
import SpeedQueenFields from './SpeedQueenFields.jsx';

import { AXIOS_MANUAL } from '../api/axios';


export default function ModalForm(
    {
        // Form handlers
        isModalOpen, 
        onCloseModal, 
        onSubmitNewService, 

        // Basic service attribute states
        newSvcName, 
        setNewSvcName, 
        newSvcUrl, 
        setNewSvcUrl, 
        newSvcType,
        setNewSvcType,

        // Manual service states
        newSvcJson, 
        setNewSvcJson, 
        newSvcExpected, 
        setNewSvcExpected, 

        // SpeedQueen service states
        newSvcToken,
        setNewSvcToken,
        newUserId,
        setNewUserId,
        newOrgId,
        setNewOrgId,

        // Form error alert
        formError,
        setFormError,

    }) {

    // Handlers for service-type selector
    const handleServiceSelect = (event) => {
        setNewSvcType(event.target.value);
    };
    // Reset all fields when service select is changed
    useEffect(() => {
        setNewSvcJson('');
        setNewSvcExpected('');
        setNewSvcToken('');
        setNewUserId('');
    }, [newSvcType]);

    // Local state for service previews
    const [fetchedData, setFetchedData] = useState(null);
    const [urlValid, setUrlValid] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const abortRef = useRef(null);   // used to cancel in-flight requests when handleUrlBlur runs

    // Clear states whenever the modal closes
    useEffect(() => {
        setNewSvcType('');
        setFetchedData(null);
        setUrlValid(null);
        setIsFetching(false);
    }, [isModalOpen])

    // Handlers for JSON Select
    const handleUrlBlur = useCallback(async () => {
        const url = (newSvcUrl || '').trim();
        setUrlValid(null);

        if (!url) return;   // exit if URL is empty
        try {
            new URL(url);
        } catch {
            console.log("URL failed sanity check.")
            setUrlValid(false);
            return;
        }

        // Cancel in-flight requests
        if (abortRef.current) {
            abortRef.current.abort();
        }
        const controller = new AbortController();
        abortRef.current = controller;

        // Fetch URL contents
        setIsFetching(true);
        try {
            const res = await AXIOS_MANUAL.get(newSvcUrl, { signal: controller.signal });

            // Basic HTTP status check
            if (res.status < 200 || res.status >= 300) {
                throw new Error(`HTTP Error ${res.status}`);
            }

            const data = res.data;

            // Ensure it's an object / array for JSON preview
            if (data && (typeof data === 'object' || Array.isArray(data))) {
                setFetchedData(data);
                setUrlValid(true);
            } else {
                setFetchedData(null);
                setUrlValid(false);
            }
        } catch (err) {
            if (err.name === 'AbortError' || err.name === 'CancelledError') return;  // swallow cancelled fetches        
            if (err.message?.includes('Network Error')) {
                console.log('Network error. Possible CORS/DNS/connectivity issue.');
            } else {
                console.log(err.message || 'Failed to fetch the URL.');
            }
            setUrlValid(false);
        } finally {
            setIsFetching(false);
        }
    }, [newSvcUrl]);

    // Reset form error every time any field changes
    useEffect(() => {
        if (formError) setFormError('');
    }, [newSvcName, newSvcUrl, newSvcType, newSvcJson, newSvcExpected, newSvcToken, newUserId, newOrgId])

    return (
        <>
            <Dialog open={isModalOpen} onClose={onCloseModal} fullWidth>
                <DialogTitle variant='h5' color='#000000' mt={1}>Add A Service</DialogTitle>

                <DialogContent sx={{ pb: 0 }}>
                        <form onSubmit={onSubmitNewService} id="add-service-form" onKeyDown={(e) => handleFormEnter(e, onSubmitNewService)}>

                            {/* Service type selector */}
                            <FormControl fullWidth size="small" margin="normal" required sx={{ mt: 1 }}>
                                <InputLabel id="service-type-label">Choose service type:</InputLabel>
                                <Select
                                    labelId="service-type-label"
                                    id="service-type"
                                    label="Choose service type:"
                                    value={newSvcType}
                                    onChange={handleServiceSelect}
                                    fullWidth
                                >
                                    <MenuItem value="speedqueen">SpeedQueen</MenuItem>
                                    <MenuItem value="manual">Manual Entry</MenuItem>
                                </Select>
                            </FormControl>
                                
                            {newSvcType === 'manual' && (
                                <ManualEntryFields
                                    // Field values and setters
                                    newSvcName={newSvcName}
                                    setNewSvcName={setNewSvcName}
                                    newSvcUrl={newSvcUrl}
                                    setNewSvcUrl={setNewSvcUrl}
                                    newSvcJson={newSvcJson}
                                    setNewSvcJson={setNewSvcJson}
                                    newSvcExpected={newSvcExpected}
                                    setNewSvcExpected={setNewSvcExpected}

                                    // Status for fetching JSON
                                    urlValid={urlValid}
                                    isFetching={isFetching}
                                    fetchedJson={fetchedData}

                                    // Event handlers
                                    handleUrlBlur={handleUrlBlur}
                                    onEnterFocusNext={onEnterFocusNext}
                                />
                            )}

                            {newSvcType === 'speedqueen' && (
                                <SpeedQueenFields 
                                    // Field values and setters
                                    newSvcName={newSvcName}
                                    setNewSvcName={setNewSvcName}
                                    setNewSvcUrl={setNewSvcUrl}
                                    newSvcToken={newSvcToken}
                                    setNewSvcToken={setNewSvcToken}
                                    newUserId={newUserId}
                                    setNewUserId={setNewUserId}
                                    newOrgId={newOrgId}
                                    setNewOrgId={setNewOrgId}

                                    // Event handlers
                                    onEnterFocusNext={onEnterFocusNext}
                                />
                            )}
                        </form>
                    {formError && (
                        <Alert severity="error" sx={{ mt: 2 }}>{formError}</Alert>
                    )}

                </DialogContent>
                <DialogActions sx={{ pb: 2 }}>
                    <Button onClick={onCloseModal}>Cancel</Button>
                    <Button type="submit" form="add-service-form">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
