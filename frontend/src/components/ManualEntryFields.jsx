import { useRef } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import DialogContentText from '@mui/material/DialogContentText';
import CircularProgress from '@mui/material/CircularProgress';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

import JsonSelector from './JsonSelector';

export default function ManualEntryFields({
  // Field values and setters
  newSvcName,
  setNewSvcName,
  newSvcUrl,
  setNewSvcUrl,
  newSvcJson,
  setNewSvcJson,
  newSvcExpected,
  setNewSvcExpected,

  // Status for fetching JSON for preview
  urlValid,
  isFetching,
  fetchedJson,

  // Event handlers
  handleUrlBlur,
  onEnterFocusNext,

  // Manual entry form errors
  formError,
  setFormError,

}) {
    // Refs for focusing in special Enter key behaviour
    const nameRef = useRef(null);
    const urlRef = useRef(null);
    const jsonRef = useRef(null);
    const expectedRef = useRef(null);

    return (
        <>
            <DialogContentText sx={{ my: 1 }}>Enter a service name and URL.</DialogContentText>
            <TextField
                id="svc-name"
                label="Service Name"
                type="text"
                placeholder="e.g. GitHub"
                autoComplete="off"
                value={newSvcName}
                onChange={(e) => setNewSvcName(e.target.value)}
                autoFocus
                required
                fullWidth
                size="small"
                margin="dense"
                inputRef={nameRef}
                onKeyDown={(e) => {onEnterFocusNext(e, urlRef)}}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Box sx={{ flexGrow: 1 }}>
                    <TextField
                        id="svc-url"
                        label="Service URL"
                        type="url"
                        placeholder="e.g. https://status.example.com/api/v2/status.json"
                        autoComplete="off"
                        value={newSvcUrl}
                        onChange={(e) => setNewSvcUrl(e.target.value)}
                        onBlur={handleUrlBlur}
                        required
                        fullWidth
                        size="small"
                        margin="dense"
                        inputRef={urlRef}
                        onKeyDown={(e) => {onEnterFocusNext(e, jsonRef)}}
                    />
                </Box>

                <Box sx={{ alignContent: 'center' }}>
                    {isFetching ? (
                        <CircularProgress size={20} sx={{ mt: 1, ml: 2 }} />
                    ) : urlValid === true ? (
                        <DoneRoundedIcon color="success" sx={{ mt: 1, ml: 1 }} />
                    ) : urlValid === false ? (
                        <ClearRoundedIcon color="fail" sx={{ mt: 1, ml: 1 }} />
                    ) : null}
                </Box>
            </Box>

            {/* JSON preview */}
            {urlValid && (
                <Box>
                    <Box
                        component="pre"
                        sx={{
                            m: 0,
                            mb: 1,
                            p: 0,
                            px: 1,
                            borderRadius: 1,
                            bgcolor: '#f5f5f5',
                            maxHeight: 200,
                            overflow: 'auto',
                        }}
                    >
                        <JsonSelector
                            fetchedJson={fetchedJson}
                            setNewSvcJson={setNewSvcJson}
                            setNewSvcExpected={setNewSvcExpected}
                        />
                    </Box>
                </Box>
            )}

            <TextField
                id="svc-json"
                label="JSON Path"
                type="text"
                placeholder="e.g. status.description"
                autoComplete="off"
                value={newSvcJson}
                onChange={(e) => setNewSvcJson(e.target.value)}
                required
                fullWidth
                size="small"
                margin="normal"
                inputRef={jsonRef}
                onKeyDown={(e) => {onEnterFocusNext(e, expectedRef)}}
            />

            <TextField
                id="svc-expected"
                label="Expected Value"
                type="text"
                placeholder="e.g. true, All Systems Operational"
                autoComplete="off"
                value={newSvcExpected}
                onChange={(e) => setNewSvcExpected(e.target.value)}
                required
                fullWidth
                size="small"
                margin="dense"
                inputRef={expectedRef}
                onKeyDown={(e) => {onEnterFocusNext(e, null)}}
            />
        </>
    );
}

