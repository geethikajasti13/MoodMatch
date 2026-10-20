const mongoose = require('mongoose');

/**
 * Connect to MongoDB using Mongoose.
 * Reads the connection URI from the MONGODB_URI environment variable.
 *
 * @returns {Promise<mongoose.Connection>} Resolves with the Mongoose connection instance upon success.
 * @throws {Error} Throws if MONGODB_URI is undefined or connection fails.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    const errorMsg = 'Database connection error: MONGODB_URI is not defined in environment variables. Please check your .env file.';
    console.error(`[Database Error] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[Database] MongoDB Connected successfully to host: ${conn.connection.host} (Database: ${conn.connection.name})`);
    return conn.connection;
  } catch (error) {
    console.error(`[Database Connection Failure] ${error.message}`);
    // Propagate error so caller (server.js or seed script) can handle or exit gracefully
    throw error;
  }
};

module.exports = connectDB;
