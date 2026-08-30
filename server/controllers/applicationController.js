const { validationResult } = require('express-validator');
const applicationService = require('../services/applicationService');

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { quoteId } = req.body;
    const application = await applicationService.submitApplication(req.user.userId, quoteId);
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Submit Application Error:', error);
    if (error.message.includes('not found') || error.message.includes('already exists') || error.message.includes('already been submitted')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getAll = async (req, res) => {
  try {
    const applications = await applicationService.getCustomerApplications(req.user.userId);
    res.status(200).json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('Get Applications Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getOne = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const application = await applicationService.getCustomerApplicationById(req.user.userId, applicationId);
    res.status(200).json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Get Application Error:', error);
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
