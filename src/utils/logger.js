const { LOG_LEVEL, NODE_ENV } = require('../config/env');

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const currentLevel = logLevels[LOG_LEVEL] || logLevels.info;

function formatMessage(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  return {
    timestamp,
    level,
    message,
    ...meta,
    environment: NODE_ENV
  };
}

const logger = {
  error: (message, meta) => {
    if (currentLevel >= logLevels.error) {
      console.error(JSON.stringify(formatMessage('error', message, meta)));
    }
  },
  warn: (message, meta) => {
    if (currentLevel >= logLevels.warn) {
      console.warn(JSON.stringify(formatMessage('warn', message, meta)));
    }
  },
  info: (message, meta) => {
    if (currentLevel >= logLevels.info) {
      console.info(JSON.stringify(formatMessage('info', message, meta)));
    }
  },
  debug: (message, meta) => {
    if (currentLevel >= logLevels.debug) {
      console.debug(JSON.stringify(formatMessage('debug', message, meta)));
    }
  }
};

module.exports = logger;
