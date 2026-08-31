const {
  Quote,
  Customer,
  Property,
  InsurancePlan,
  Coverage,
} = require("../models");
const riskService = require("./riskService");

const getCustomerId = async (userId) => {
  const customer = await Customer.findOne({ where: { user_id: userId } });
  if (!customer) throw new Error("Customer not found");
  return customer.id;
};

const generateQuote = async (userId, propertyId, planId) => {
  const customerId = await getCustomerId(userId);

  // Validate Property
  const property = await Property.findOne({
    where: { id: propertyId, customer_id: customerId },
  });
  if (!property) {
    throw new Error("Property not found or does not belong to the customer");
  }

  // Validate Insurance Plan and fetch coverages
  const plan = await InsurancePlan.findByPk(planId, {
    include: [{ model: Coverage, through: { attributes: [] } }],
  });
  if (!plan) {
    throw new Error("Insurance plan not found");
  }

  // 1. Calculate Risk
  const { riskScore, riskLevel } = riskService.assessRisk(property);

  // 2. Calculate Premium
  let totalPremium = Number(plan.base_premium);

  // Add additional premiums from all associated coverages
  if (plan.Coverages && plan.Coverages.length > 0) {
    for (const coverage of plan.Coverages) {
      totalPremium += Number(coverage.additional_premium);
    }
  }

  // Apply Risk Multiplier
  let riskMultiplier = 1.0;
  if (riskLevel === "MEDIUM") riskMultiplier = 1.15;
  if (riskLevel === "HIGH") riskMultiplier = 1.3;

  totalPremium = totalPremium * riskMultiplier;

  // Round to 2 decimal places
  const finalPremium = Math.round(totalPremium * 100) / 100;

  // 3. Create Quote Record
  const quote = await Quote.create({
    customer_id: customerId,
    property_id: propertyId,
    plan_id: planId,
    premium: finalPremium,
    risk_score: riskScore,
    risk_level: riskLevel,
    status: "GENERATED",
  });

  // 4. Return detailed response
  return {
    quote,
    property,
    plan,
    riskAssessment: {
      score: riskScore,
      level: riskLevel,
    },
  };
};

const getQuotesByCustomer = async (userId) => {
  const customerId = await getCustomerId(userId);
  return await Quote.findAll({
    where: { customer_id: customerId },
    include: [
      { model: Property },
      {
        model: InsurancePlan,
        include: [{ model: Coverage, through: { attributes: [] } }],
      },
    ],
  });
};

const getQuoteByIdAndCustomer = async (quoteId, userId) => {
  const customerId = await getCustomerId(userId);
  const quote = await Quote.findOne({
    where: { id: quoteId, customer_id: customerId },
    include: [
      { model: Property },
      {
        model: InsurancePlan,
        include: [{ model: Coverage, through: { attributes: [] } }],
      },
    ],
  });

  if (!quote)
    throw new Error("Quote not found or does not belong to the customer");

  return quote;
};

module.exports = {
  generateQuote,
  getQuotesByCustomer,
  getQuoteByIdAndCustomer,
};
