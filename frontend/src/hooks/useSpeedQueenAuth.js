import { useState, useRef, useCallback } from 'react';
import { AXIOS_SQ_LOGIN } from '../api/axios';

export function useSpeedQueenAuth({ setNewSvcToken, setNewUserId }) {
    // Local states for login verification
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPass, setLoginPass] = useState('');

    // UI error reporting
    const [loginState, setLoginState] = useState(null);
    const [loginMessage, setLoginMessage] = useState('');

    // Refs to request login on blur of login details
    const isSubmittingRef = useRef(false);
    const lastSubmittedRef = useRef({ email: '', pass: '' });

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
            const user_id = data.data.id ?? null;

            // Save token and set login alert message
            setNewSvcToken(token);
            setNewUserId(user_id);
            setLoginState('valid');
            setLoginMessage('Authentication token retrieved successfully.');
        } catch (err) {
            const status = err?.response?.status;

            // Catch invalid login details error
            if (status === 400 || status === 401 || status === 403) {
                setLoginState('invalid');
                setLoginMessage('Invalid login details.');
            } else {
                setLoginState('invalid');
                setLoginMessage(err?.message || `Failed with code ${status}.`);
            }
        }
    }, [loginEmail, loginPass, setNewSvcToken, setNewUserId]);

    // Request login on blur of login details
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

            // Perform login and remember submission
            await handleLoginForToken();
            lastSubmittedRef.current = { email, pass };
        } finally {
            isSubmittingRef.current = false;
        }
    }, [loginEmail, loginPass, handleLoginForToken, setNewSvcToken, setNewUserId]);

    return {
        loginEmail,
        setLoginEmail,
        loginPass,
        setLoginPass,
        loginState,
        loginMessage,
        attemptLoginOnBlur,
    };
}