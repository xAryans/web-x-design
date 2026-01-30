require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

const apiRoutes = require('./routes/api');

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Connect Database
connectDB();

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('Hospital Management System API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
