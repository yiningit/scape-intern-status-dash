import { useState, useRef } from 'react';
import { handleFormEnter, onEnterFocusNext } from '../utils/focusOnEnter.js';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { AXIOS } from '../api/axios.js';
import { getServerError } from '../utils/http.js';

export default function LoginPage({ onLogin, loading = false }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);   // ADD SHOW/HIDE PASSWORD FUNCTIONALITY
    const [error, setError] = useState('');

    // Refs for focusing for special Enter behaviour
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    
    // Local loading states for each button
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const disabled = loading || isSigningIn || isRegistering;   // disable both buttons while logging in

    // Handler for Login button
    const handleSubmit = async () => {
        setError('');
        setIsSigningIn(true);
        try {
            const res = await AXIOS.post('/auth/login', { username, password });   // route returns {token, user: {id, username}}
            localStorage.setItem("token", res.data.token);   // save login token to persist on reload
            localStorage.setItem("user", username);
            onLogin();
        } catch (err) {
            setError(getServerError(err, "Invalid username or password"));
        } finally {
            setIsSigningIn(false);
        }
    };

    // Handler for Register button
    const handleRegister = async () => {
        setError('');
        setIsRegistering(true);
        try { 
            const res = await AXIOS.post('/auth/register', { username, password });

            // Auto-login right after registering
            try {
                if (res?.data?.token) {
                    localStorage.setItem("token", res.data.token);
                    localStorage.setItem("user", username);
                    onLogin();
                } else {
                    setError("Registered, but failed to sign in automatically.");
                }
            } catch {
                setError("Registered successfully. Please sign in.");
            }
        } catch (err) {
            setError(getServerError(err, "Invalid username or password"));
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography variant='h5' color='primary' gutterBottom align='center'>
                        Sign in
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} onKeyDown={(e) => {handleFormEnter(e, handleSubmit)}} noValidate>   
                        <TextField
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            autoFocus
                            inputRef={usernameRef}
                            onKeyDown={(e) => {onEnterFocusNext(e, passwordRef)}}
                        />
        
                        <TextField
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            inputRef={passwordRef}
                            onKeyDown={(e) => {onEnterFocusNext(e, handleSubmit)}}
                            // ADD SHOW/HIDE PASSWORD BUTTON
                        />

                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            disabled={disabled}
                            sx={{ mt: 1.5, color: '#ffffff' }}
                        >
                            {isSigningIn || loading ? "Signing in..." : "Sign In"}
                        </Button>

                        <Button
                            type="button"
                            variant="outlined"
                            color="primary"
                            fullWidth
                            size="large"
                            disabled={disabled}
                            onClick={handleRegister}
                            sx={{ mt: 1.5 }}
                        >
                            {isRegistering ? "Registering..." : "Register"}
                        </Button>                    
                    </Box>
                </Paper>
            </Box>
        </Container>
    )
}