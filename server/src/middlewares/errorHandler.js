/**
 * Centralized error handling middleware
 */
exports.errorHandler = (err, req, res, next) => {
  console.error('[Error Details]:', err.message);

  let statusCode = err.status || err.statusCode || 500;
  if (err.name === 'MulterError' || err.message?.includes('Unsupported file type')) {
    statusCode = 400;
  }
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      status: statusCode,
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * 404 Route Not Found handler
 */
exports.notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      status: 404
    }
  });
};
