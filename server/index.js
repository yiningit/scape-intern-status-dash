// Apply environment variables
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';

const app = express();
app.use((express.json()));
app.use((express.urlencoded({ limit: "30mb", extended: true})))
app.use((cors()));

// Mount routes
// app.use('/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(DB_URL)
    .then(() => console.log("Mongo connected"))
    .catch(err => console.error(`Mongo connection error: ${err}`))

// Start server
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
