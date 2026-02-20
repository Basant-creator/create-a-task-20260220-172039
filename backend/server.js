const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Load env vars
dotenv.config({ path: '.env' });

// Connect to database
connectDB();

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors()); // Enable CORS for all routes - adjust in production

// Body parser
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
// app.use('/api/tasks', require('./routes/tasks')); // Future task routes

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Serve static files from the app directory, but protected
// This setup assumes the client-side JS (dashboard.js) handles token validation and redirects.
// For true server-side protection of these static assets, you'd want middleware here.
// For simplicity in this example, client-side JS handles redirection,
// and the server just serves them. In a robust app, protected static assets
// might be served after a server-side auth check or through templating.
app.use('/app', express.static(path.join(__dirname, '../app')));

// Example of a protected route for HTML serving (more robust for protected content)
const authMiddleware = require('./middleware/auth');
app.get('/app/dashboard.html', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../app/dashboard.html'));
});
app.get('/app/profile.html', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../app/profile.html'));
});
app.get('/app/settings.html', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../app/settings.html'));
});

// Catch-all for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server Error'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));