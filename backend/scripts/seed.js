const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from backend/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('../config/db');
const Content = require('../models/Content');
const sampleContents = require('../data/sampleContent');

/**
 * Executes idempotent database seeding.
 * Uses findOneAndUpdate with upsert to prevent duplicates when executed multiple times.
 * Never drops or deletes existing collections by default.
 */
const seedDatabase = async () => {
  try {
    console.log('[Seed] Initiating database connection...');
    await connectDB();

    console.log(`[Seed] Processing ${sampleContents.length} curated content records from data/sampleContent.js...`);

    let processedCount = 0;
    for (const item of sampleContents) {
      // Uniquely identify records by title and contentType
      const query = { title: item.title, contentType: item.contentType };

      await Content.findOneAndUpdate(query, item, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      });

      processedCount++;
    }

    console.log(`[Seed] Successfully processed and seeded ${processedCount} records without duplicates.`);
  } catch (error) {
    console.error(`[Seed Error] Failed to complete database seeding: ${error.message}`);
    process.exitCode = 1;
  } finally {
    try {
      await mongoose.connection.close();
      console.log('[Seed] Database connection closed.');
    } catch (closeError) {
      console.error(`[Seed Warning] Error closing database connection: ${closeError.message}`);
    }
  }
};

// Execute if run directly from CLI
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleContents };
