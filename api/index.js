const { app, connectDB, mongoose } = require('../backend/server');

// Cache database connection across serverless invocations
let isConnecting = false;

async function ensureDbConnected() {
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    return;
  }
  if (!isConnecting) {
    isConnecting = true;
    try {
      await connectDB();
    } catch (err) {
      console.error('[Vercel Serverless] Database connection error:', err.message);
    } finally {
      isConnecting = false;
    }
  }
}

module.exports = async (req, res) => {
  await ensureDbConnected();
  return app(req, res);
};
