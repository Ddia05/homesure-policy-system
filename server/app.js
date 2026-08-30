const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const planRoutes = require('./routes/planRoutes');
const coverageRoutes = require('./routes/coverageRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const policyRoutes = require('./routes/policyRoutes');
const policyRequestRoutes = require('./routes/policyRequestRoutes');
const agentRoutes = require('./routes/agentRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/coverages', coverageRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/policy-requests', policyRequestRoutes);
app.use('/api/agent', agentRoutes);

// Basic Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HomeSure API is running'
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

module.exports = app;
