import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    // Fail fast if env secret couldn't be reached
    throw new Error("JWT_SECRET is not set. Load it from .env or your environment variables.")
}

// Create digital signature to ensure token's authenticity and integrity
function signToken(payload) {
    try {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    } catch (err) {
        console.log(err);
    }
};

export const register = async (req, res) => {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    try {
        // Create user in database
        const user = await User.create({ username, passwordHash });

        // Create sign-in token for this instance
        const token = signToken({ id: user._id, username: user.username });
        return res.status(201).json({ token, user: { id: user._id, username: user.username } });
    } catch (err) {
        return res.status(400).json({ error: "Username already in use" });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
        console.log("Username and password are required");
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid username or password" });

    // Compare encrypted password with database of users
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!user || !ok) return res.status(401).json({ error: "Invalid username or password" });

    // Create sign-in token for this instance
    const token = signToken({ id: user._id, username: user.username });
    return res.json({ token, user: { id: user._id, username: user.username } });
};