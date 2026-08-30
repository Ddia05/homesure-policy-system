const { validationResult } = require('express-validator');
const policyRequestService = require('../services/policyRequestService');

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { policyId, requestType, description } = req.body;
    const policyRequest = await policyRequestService.createRequest(req.user.userId, policyId, requestType, description);
    
    res.status(201).json({
      success: true,
      message: 'Policy request created successfully',
      policyRequest
    });
  } catch (error) {
    console.error('Create Policy Request Error:', error);
    if (error.message.includes('not found') || error.message.includes('Cannot create')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getAll = async (req, res) => {
  try {
    const policyRequests = await policyRequestService.getCustomerRequests(req.user.userId);
    res.status(200).json({
      success: true,
      policyRequests
    });
  } catch (error) {
    console.error('Get Customer Policy Requests Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getOne = async (req, res) => {
  try {
    const requestId = req.params.id;
    const policyRequest = await policyRequestService.getCustomerRequestById(req.user.userId, requestId);
    res.status(200).json({
      success: true,
      policyRequest
    });
  } catch (error) {
    console.error('Get Customer Policy Request Error:', error);
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
