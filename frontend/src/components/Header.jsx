import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import RestoreRoundedIcon from '@mui/icons-material/RestoreRounded';

import logo from '../assets/scape-logo.png';

export default function Header({onReset, loggedIn, user, onLogout}) {
    return (
        <AppBar position="static">
            <Toolbar>
                <Box
                    component="img"
                    src={logo}
                    alt="Scape Logo"
                    sx={{
                        height: 25,
                        mr: 3,
                        mt: 1,
                    }}
                />

                <Typography variant="h5" >
                    Services Status Dashboard
                </Typography>

                {loggedIn && (
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ flexGrow: 1, ml: 3, px: 3 }}>
                        <Typography variant="subtitle1" color='#ffffff' fontSize="large" sx={{ ml: 3 }}>
                            Logged in as: {user}
                        </Typography>

                        <Button onClick={onLogout} variant="contained" color="secondary" endIcon={<LogoutIcon />} sx={{ color: '#ffffff', p: 0.5, px: 1 }}>
                            Logout
                        </Button>
                    </Stack>
                )}

                <Box>
                    <Button onClick={onReset} variant="contained" color='secondary' startIcon={<RestoreRoundedIcon />} sx={{ color: '#ffffff' }}>
                        Reset to Default Services
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
