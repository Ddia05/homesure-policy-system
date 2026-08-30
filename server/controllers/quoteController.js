const { validationResult } = require('express-validator');
const quoteService = require('../services/quoteService');

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { propertyId, planId } = req.body;
    const result = await quoteService.generateQuote(req.user.userId, propertyId, planId);
    
    res.status(201).json({
      success: true,
      message: 'Quote generated successfully',
      ...result
    });
  } catch (error) {
    console.error('Generate Quote Error:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getAll = async (req, res) => {
  try {
    const quotes = await quoteService.getQuotesByCustomer(req.user.userId);
    res.status(200).json({
      success: true,
      quotes
    });
  } catch (error) {
    console.error('Get Quotes Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getOne = async (req, res) => {
  try {
    const quoteId = req.params.id;
    const quote = await quoteService.getQuoteByIdAndCustomer(quoteId, req.user.userId);
    res.status(200).json({
      success: true,
      quote
    });
  } catch (error) {
    console.error('Get Quote Error:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  create,
  getAll,
  getOne
};
