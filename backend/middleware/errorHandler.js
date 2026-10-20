/**
 * Centralized Error Handling Middleware
 * Ensures consistent JSON responses and protects sensitive system details.
 */

function errorHandler(err, req, res, next) {
  // Log server-side error without leaking sensitive credentials
  console.error('[ServerError]', {
    message: err.message,
    path: req.originalUrl,
    method: req.method,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Handle Mongoose CastError (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: `Invalid format for field '${err.path}': '${err.value}'`
    });
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: messages
    });
  }

  // Handle duplicate key error (MongoDB error code 11000)
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: 'Duplicate entry detected'
    });
  }

  // Handle SyntaxError in JSON body parsing
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Malformed JSON payload'
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const clientMessage =
    statusCode >= 500
      ? 'An unexpected server error occurred. Please try again later.'
      : err.message || 'Request failed';

  return res.status(statusCode).json({
    success: false,
    error: clientMessage
  });
}

/**
 * 404 Not Found Middleware for unmatched routes
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: `Resource not found: ${req.method} ${req.originalUrl}`
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
