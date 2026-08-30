const policyService = require('../services/policyService');

const getAll = async (req, res) => {
  try {
    const policies = await policyService.getCustomerPolicies(req.user.userId);
    res.status(200).json({
      success: true,
      policies
    });
  } catch (error) {
    console.error('Get Customer Policies Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getOne = async (req, res) => {
  try {
    const policyId = req.params.id;
    const policy = await policyService.getCustomerPolicyById(policyId, req.user.userId);
    res.status(200).json({
      success: true,
      policy
    });
  } catch (error) {
    console.error('Get Customer Policy Error:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getAll,
  getOne
};
