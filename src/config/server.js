const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { CORS_ORIGIN } = require('./env');

const app = express();

// Use more specific CORS configuration
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Use express.json() instead of bodyParser (bodyParser is now deprecated)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports = { app };
