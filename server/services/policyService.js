const {
  Policy,
  Application,
  Quote,
  Customer,
  User,
  Property,
  InsurancePlan,
  Coverage,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

const generatePolicyNumber = async (transaction) => {
  const currentYear = new Date().getFullYear();

  // Find the highest existing policy ID or number to guarantee uniqueness
  // In a robust system, we would use a sequence or auto-increment pattern safely.
  // For this project, we count existing policies for the current year.
  const policyCount = await Policy.count({
    where: {
      policy_number: {
        [Op.like]: `HOME-${currentYear}-%`,
      },
    },
    transaction,
  });

  const nextNumber = policyCount + 1;
  const paddedNumber = nextNumber.toString().padStart(4, "0");

  return `HOME-${currentYear}-${paddedNumber}`;
};

const getCustomerId = async (userId) => {
  const customer = await Customer.findOne({ where: { user_id: userId } });
  if (!customer) throw new Error("Customer not found");
  return customer.id;
};

const issuePolicy = async (applicationId) => {
  const application = await Application.findByPk(applicationId, {
    include: [
      {
        model: Quote,
        include: [{ model: Property }, { model: InsurancePlan }],
      },
    ],
  });

  if (!application) {
    throw new Error("Application not found");
  }

  if (application.status !== "APPROVED") {
    throw new Error("Application must be APPROVED to issue a policy");
  }

  // Check if a policy already exists for this application
  const existingPolicy = await Policy.findOne({
    where: { application_id: applicationId },
  });
  if (existingPolicy) {
    throw new Error("A policy has already been issued for this application");
  }

  const transaction = await sequelize.transaction();
  try {
    const policyNumber = await generatePolicyNumber(transaction);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(startDate.getFullYear() + 1);

    const policy = await Policy.create(
      {
        policy_number: policyNumber,
        application_id: application.id,
        customer_id: application.customer_id,
        property_id: application.Quote.property_id,
        plan_id: application.Quote.plan_id,
        premium: application.Quote.premium,
        start_date: startDate,
        end_date: endDate,
        status: "ACTIVE",
      },
      { transaction },
    );

    await transaction.commit();
    return policy;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getCustomerPolicies = async (userId) => {
  const customerId = await getCustomerId(userId);
  return await Policy.findAll({
    where: { customer_id: customerId },
    include: [{ model: Property }, { model: InsurancePlan }],
  });
};

const getCustomerPolicyById = async (policyId, userId) => {
  const customerId = await getCustomerId(userId);
  const policy = await Policy.findOne({
    where: { id: policyId, customer_id: customerId },
    include: [
      {
        model: Customer,
        include: [{ model: User, attributes: ["email"] }],
      },
      { model: Property },
      {
        model: InsurancePlan,
        include: [{ model: Coverage }],
      },
    ],
  });

  if (!policy)
    throw new Error("Policy not found or does not belong to the customer");
  return policy;
};

const getAllPolicies = async () => {
  return await Policy.findAll({
    include: [
      {
        model: Customer,
        include: [{ model: User, attributes: ["email"] }],
      },
      { model: Property },
      {
        model: InsurancePlan,
        include: [{ model: Coverage }],
      },
    ],
  });
};

const getPolicyById = async (policyId) => {
  const policy = await Policy.findOne({
    where: { id: policyId },
    include: [
      {
        model: Customer,
        include: [{ model: User, attributes: ["email"] }],
      },
      { model: Property },
      {
        model: InsurancePlan,
        include: [{ model: Coverage }],
      },
    ],
  });

  if (!policy) throw new Error("Policy not found");
  return policy;
};

module.exports = {
  issuePolicy,
  getCustomerPolicies,
  getCustomerPolicyById,
  getAllPolicies,
  getPolicyById,
};
