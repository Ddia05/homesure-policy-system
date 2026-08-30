const planService = require('../services/planService');

const getAllPlans = async (req, res) => {
  try {
    const plans = await planService.getAllPlans();
    res.status(200).json({
      success: true,
      plans
    });
  } catch (error) {
    console.error('Get All Plans Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getPlanById = async (req, res) => {
  try {
    const planId = req.params.id;
    const plan = await planService.getPlanById(planId);
    res.status(200).json({
      success: true,
      plan
    });
  } catch (error) {
    console.error('Get Plan Error:', error);
    if (error.message === 'Insurance plan not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getAllCoverages = async (req, res) => {
  try {
    const coverages = await planService.getAllCoverages();
    res.status(200).json({
      success: true,
      coverages
    });
  } catch (error) {
    console.error('Get All Coverages Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getAllPlans,
  getPlanById,
  getAllCoverages
};
