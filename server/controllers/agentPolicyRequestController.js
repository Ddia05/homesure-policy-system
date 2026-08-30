const policyRequestService = require('../services/policyRequestService');

const getAll = async (req, res) => {
  try {
    const policyRequests = await policyRequestService.getAllRequests();
    res.status(200).json({
      success: true,
      policyRequests
    });
  } catch (error) {
    console.error('Agent Get Policy Requests Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getOne = async (req, res) => {
  try {
    const requestId = req.params.id;
    const policyRequest = await policyRequestService.getRequestById(requestId);
    res.status(200).json({
      success: true,
      policyRequest
    });
  } catch (error) {
    console.error('Agent Get Policy Request Error:', error);
    if (error.message === 'Policy request not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const approve = async (req, res) => {
  try {
    const requestId = req.params.id;
    const policyRequest = await policyRequestService.reviewRequest(requestId, req.user.userId, 'APPROVE');
    
    res.status(200).json({
      success: true,
      message: 'Policy request approved successfully',
      policyRequest
    });
  } catch (error) {
    console.error('Approve Policy Request Error:', error);
    if (error.message.includes('already been') || error.message.includes('not found')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const reject = async (req, res) => {
  try {
    const requestId = req.params.id;
    const policyRequest = await policyRequestService.reviewRequest(requestId, req.user.userId, 'REJECT');
    
    res.status(200).json({
      success: true,
      message: 'Policy request rejected successfully',
      policyRequest
    });
  } catch (error) {
    console.error('Reject Policy Request Error:', error);
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
