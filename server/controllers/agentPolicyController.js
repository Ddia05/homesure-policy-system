const policyService = require('../services/policyService');

const issuePolicy = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const policy = await policyService.issuePolicy(applicationId);
    
    res.status(201).json({
      success: true,
      message: 'Policy issued successfully',
      policy
    });
  } catch (error) {
    console.error('Issue Policy Error:', error);
    if (error.message.includes('not found') || error.message.includes('must be APPROVED') || error.message.includes('already been issued')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getAll = async (req, res) => {
  try {
    const policies = await policyService.getAllPolicies();
    res.status(200).json({
      success: true,
      policies
    });
  } catch (error) {
    console.error('Agent Get Policies Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getOne = async (req, res) => {
  try {
    const policyId = req.params.id;
    const policy = await policyService.getPolicyById(policyId);
    res.status(200).json({
      success: true,
      policy
    });
  } catch (error) {
    console.error('Agent Get Policy Error:', error);
    if (error.message === 'Policy not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  issuePolicy,
  getAll,
  getOne
};
