const {
  PolicyRequest,
  Policy,
  Customer,
  Property,
  User,
  sequelize,
} = require("../models");

const getCustomerId = async (userId) => {
  const customer = await Customer.findOne({ where: { user_id: userId } });
  if (!customer) throw new Error("Customer not found");
  return customer.id;
};

// Customer operations
const createRequest = async (userId, policyId, requestType, description) => {
  const customerId = await getCustomerId(userId);

  const policy = await Policy.findOne({
    where: { id: policyId, customer_id: customerId },
  });

  if (!policy) {
    throw new Error("Policy not found or does not belong to the customer");
  }

  if (policy.status !== "ACTIVE" && requestType !== "RENEWAL") {
    throw new Error(
      "Cannot create request for an inactive policy (except renewals)",
    );
  }

  return await PolicyRequest.create({
    policy_id: policyId,
    request_type: requestType,
    description: description,
    status: "PENDING",
  });
};

const getCustomerRequests = async (userId) => {
  const customerId = await getCustomerId(userId);
  return await PolicyRequest.findAll({
    include: [
      {
        model: Policy,
        where: { customer_id: customerId },
        attributes: ["id", "policy_number"], // Just return some basic policy info
      },
    ],
  });
};

const getCustomerRequestById = async (userId, requestId) => {
  const customerId = await getCustomerId(userId);
  const request = await PolicyRequest.findOne({
    where: { id: requestId },
    include: [
      {
        model: Policy,
        where: { customer_id: customerId },
      },
    ],
  });

  if (!request) throw new Error("Policy request not found");
  return request;
};

// Agent operations
const getAllRequests = async () => {
  return await PolicyRequest.findAll({
    include: [
      { model: Policy },
      { model: User, as: "reviewer", attributes: ["id", "email"] },
    ],
  });
};

const getRequestById = async (requestId) => {
  const request = await PolicyRequest.findByPk(requestId, {
    include: [
      { model: Policy, include: [{ model: Property }] },
      { model: User, as: "reviewer", attributes: ["id", "email"] },
    ],
  });

  if (!request) throw new Error("Policy request not found");
  return request;
};

const reviewRequest = async (requestId, agentUserId, action) => {
  const request = await PolicyRequest.findByPk(requestId, {
    include: [{ model: Policy, include: [{ model: Property }] }],
  });

  if (!request) {
    throw new Error("Policy request not found");
  }

  if (request.status !== "PENDING") {
    throw new Error(`Request has already been ${request.status.toLowerCase()}`);
  }

  const transaction = await sequelize.transaction();
  try {
    const newStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";

    await request.update(
      {
        status: newStatus,
        reviewed_by: agentUserId,
        reviewed_at: new Date(),
      },
      { transaction },
    );

    // Apply policy changes if approved
    if (newStatus === "APPROVED") {
      const policy = request.Policy;

      if (request.request_type === "ADDRESS_CHANGE") {
        // Simplified approach: updating the property address to the description text
        if (policy.Property) {
          await policy.Property.update(
            {
              address: request.description,
            },
            { transaction },
          );
        }
      } else if (request.request_type === "RENEWAL") {
        const currentEndDate = new Date(policy.end_date);
        const newEndDate = new Date(
          currentEndDate.setFullYear(currentEndDate.getFullYear() + 1),
        );
        await policy.update(
          { end_date: newEndDate, status: "ACTIVE" },
          { transaction },
        );
      } else if (request.request_type === "CANCELLATION") {
        await policy.update({ status: "CANCELLED" }, { transaction });
      } else if (
        request.request_type === "ADD_COVERAGE" ||
        request.request_type === "REMOVE_COVERAGE"
      ) {
        // Existing database design (InsurancePlan -> ProductCoverage -> Coverage) doesn't support
        // per-policy coverage additions/removals safely without a new junction table (e.g., PolicyCoverages).
        // Therefore, we skip database update and just record the approval of the transaction in policy_requests.
        console.log(
          `Approval for ${request.request_type} processed without DB schema changes.`,
        );
      }
    }

    await transaction.commit();
    return request;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  createRequest,
  getCustomerRequests,
  getCustomerRequestById,
  getAllRequests,
  getRequestById,
  reviewRequest,
};
