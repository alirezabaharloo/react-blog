const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import and use the main index.js file
const mainRoutes = require('./index');

// Welcome route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Set port
const PORT = process.env.PORT || 8000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});