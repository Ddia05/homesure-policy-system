const { InsurancePlan, Coverage } = require('../models');

const getAllPlans = async () => {
  return await InsurancePlan.findAll();
};

const getPlanById = async (planId) => {
  const plan = await InsurancePlan.findByPk(planId, {
    include: [
      {
        model: Coverage,
        through: { attributes: [] } // Exclude the join table attributes from the response
      }
    ]
  });

  if (!plan) {
    throw new Error('Insurance plan not found');
  }

  return plan;
};

const getAllCoverages = async () => {
  return await Coverage.findAll();
};

module.exports = {
  getAllPlans,
  getPlanById,
  getAllCoverages
};
