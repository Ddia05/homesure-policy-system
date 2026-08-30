const { validationResult } = require('express-validator');
const applicationService = require('../services/applicationService');

const getAll = async (req, res) => {
  try {
    const applications = await applicationService.getAllApplications();
    res.status(200).json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('Agent Get Applications Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getOne = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const application = await applicationService.getApplicationForReview(applicationId);
    res.status(200).json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Agent Get Application Error:', error);
    if (error.message === 'Application not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const approve = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const applicationId = req.params.id;
    const { reviewNotes } = req.body;
    
    const application = await applicationService.reviewApplication(applicationId, req.user.userId, 'APPROVE', reviewNotes);
    
    res.status(200).json({
      success: true,
      message: 'Application approved successfully',
      application
    });
  } catch (error) {
    console.error('Approve Application Error:', error);
    if (error.message.includes('already been') || error.message.includes('not found')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const reject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const applicationId = req.params.id;
    const { reviewNotes } = req.body;
    
    const application = await applicationService.reviewApplication(applicationId, req.user.userId, 'REJECT', reviewNotes);
    
    res.status(200).json({
      success: true,
      message: 'Application rejected successfully',
      application
    });
  } catch (error) {
    console.error('Reject Application Error:', error);
    if (error.message.includes('already been') || error.message.includes('not found')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getAll,
  getOne,
  approve,
  reject
};
