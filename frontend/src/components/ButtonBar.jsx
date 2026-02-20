import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';

export default function ButtonBar({lastUpdated, loading, onReload, onOpenModal}) {
    return (
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'flex-end', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1, px: 2 }}>
                <Typography variant="subtitle1">
                    Last updated: {lastUpdated}
                </Typography>
            </Box>

            <Box>
                <Button onClick={onReload} loading={loading} loadingIndicator="Reloading..." variant="outlined" color='secondary' startIcon={<RefreshIcon />}>
                    Reload
                </Button>
            </Box>

            <Box>
                <Button onClick={onOpenModal} variant="contained" color='secondary' startIcon={<AddIcon />} sx={{ color: '#ffffff' }}>
                    Add a service
                </Button>
            </Box>
        </Box>
    );
}