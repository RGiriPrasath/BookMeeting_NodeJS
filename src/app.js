const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PORT } = require('./config/env');
const bookingRoutes = require('./routes/bookingRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Register routes
app.use('/', bookingRoutes);

// Register 404 handler
app.use(notFoundHandler);

// Register error handler
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
  process.exit(1);
});