require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const contentRoutes = require('./routes/contentRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const savedRoutes = require('./routes/savedRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/moodmatch';

// Configure CORS
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (such as mobile apps or curl/Postman) or allowed client URL
    if (!origin || origin === CLIENT_URL || CLIENT_URL === '*') {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for local dev testing while client URL is logged
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;

  if (!isDbConnected) {
    console.error('[HealthCheck] Database is not connected. Current state:', mongoose.connection.readyState);
    return res.status(503).json({
      status: 'degraded',
      service: 'MoodMatch API',
      database: 'disconnected'
    });
  }

  return res.status(200).json({
    status: 'ok',
    service: 'MoodMatch API'
  });
});

// Register API Routes
app.use('/api/content', contentRoutes);
app.use('/api/recommend', recommendationRoutes);
app.use('/api/saved', savedRoutes);

// 404 Handler for undefined routes
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

/**
 * Connect to MongoDB database
 */
async function connectDB(uri = MONGODB_URI) {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('[Database] Successfully connected to MongoDB at:', uri.replace(/\/\/.*@/, '//<credentials>@'));
    return true;
  } catch (err) {
    console.error('[Database] MongoDB connection failed:', err.message);
    return false;
  }
}

/**
 * Start the Express server
 */
async function startServer() {
  const dbConnected = await connectDB();
  if (!dbConnected) {
    console.warn('[Database] Server starting without active database connection. Ensure MongoDB is running.');
  }

  const server = app.listen(PORT, () => {
    console.log(`[Server] MoodMatch API listening on port ${PORT}`);
    console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
  });

  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = { app, connectDB, startServer };
