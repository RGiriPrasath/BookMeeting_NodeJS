const { NODE_ENV } = require('../config/env');

// Central error handling middleware
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  
  // Log the error
  console.error(`Error: ${err.message}`);
  
  // Send appropriate response based on environment
  res.status(statusCode).json({
    status: 'error',
    message: NODE_ENV === 'production' ? 'An error occurred' : err.message,
    stack: NODE_ENV === 'production' ? undefined : err.stack
  });
}

// 404 handler
function notFoundHandler(req, res) {
  res.status(404).json({
    status: 'error',
    message: 'Resource not found'
  });
}

module.exports = { errorHandler, notFoundHandler };
