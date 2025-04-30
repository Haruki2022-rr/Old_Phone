// Reference https://medium.com/@sindoojagajam2023/setting-up-your-first-mern-stack-project-a-step-by-step-tutorial-0a4f88fa4e98
// This file is entry point.
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); //To enable cross-origin requests
require('dotenv').config(); // To store sentitve info in .env file
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection

// Basic Route
app.get('/', (req, res) => {
 res.send('Hello from the backend!');
});
// Start Server
app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});