const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from backend/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('../config/db');
const Content = require('../models/Content');
const extendedContent = require('../data/extendedContent');

/**
 * Executes idempotent database seeding for the extended dataset.
 * Seeds 50 curated records (movies, series, and books) featuring real official poster URLs.
 * Uses findOneAndUpdate with upsert to prevent duplicates and safely updates records.
 */
const seedExtendedDatabase = async () => {
  try {
    console.log('[Seed Extended] Initiating database connection...');
    await connectDB();

    console.log(`[Seed Extended] Processing ${extendedContent.length} extended content records from data/extendedContent.js...`);

    let processedCount = 0;
    for (const item of extendedContent) {
      // Uniquely identify records by title and contentType
      const query = { title: item.title, contentType: item.contentType };

      await Content.findOneAndUpdate(query, item, {
        upsert: true,
        returnDocument: 'after',
        setDefaultsOnInsert: true,
        runValidators: true,
      });

      processedCount++;
    }

    console.log(`[Seed Extended] Successfully seeded and updated ${processedCount} records with real poster thumbnails!`);
  } catch (error) {
    console.error(`[Seed Extended Error] Failed to complete database seeding: ${error.message}`);
    process.exitCode = 1;
  } finally {
    try {
      await mongoose.connection.close();
      console.log('[Seed Extended] Database connection closed.');
    } catch (closeError) {
      console.error(`[Seed Extended Warning] Error closing database connection: ${closeError.message}`);
    }
  }
};

// Execute if run directly from CLI
if (require.main === module) {
  seedExtendedDatabase();
}

module.exports = { seedExtendedDatabase, extendedContent };
