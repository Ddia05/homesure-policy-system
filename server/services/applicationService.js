const { Application, Quote, Customer, User, Property, InsurancePlan, Coverage } = require('../models');

const getCustomerId = async (userId) => {
  const customer = await Customer.findOne({ where: { user_id: userId } });
  if (!customer) throw new Error('Customer not found');
  return customer.id;
};

// Customer operations
const submitApplication = async (userId, quoteId) => {
  const customerId = await getCustomerId(userId);

  const quote = await Quote.findOne({
    where: { id: quoteId, customer_id: customerId }
  });

  if (!quote) {
    throw new Error('Quote not found or does not belong to the customer');
  }

  // Check if quote status allows submission
  if (quote.status === 'ACCEPTED') {
    throw new Error('Quote has already been submitted as an application');
  }

  // Check if application already exists for this quote
  const existingApp = await Application.findOne({ where: { quote_id: quoteId } });
  if (existingApp) {
    throw new Error('An application for this quote already exists');
  }

  // Update quote status
  await quote.update({ status: 'ACCEPTED' });

  // Create application
  return await Application.create({
    quote_id: quoteId,
    customer_id: customerId,
    status: 'SUBMITTED'
  });
};

const getCustomerApplications = async (userId) => {
  const customerId = await getCustomerId(userId);
  return await Application.findAll({
    where: { customer_id: customerId },
    include: [
      {
        model: Quote,
        include: [
          { model: Property },
          { model: InsurancePlan }
        ]
      }
    ]
  });
};

const getCustomerApplicationById = async (userId, applicationId) => {
  const customerId = await getCustomerId(userId);
  const application = await Application.findOne({
    where: { id: applicationId, customer_id: customerId },
    include: [
      {
        model: Quote,
        include: [
          { model: Property },
          { model: InsurancePlan, include: [{ model: Coverage, through: { attributes: [] } }] }
        ]
      }
    ]
  });

  if (!application) throw new Error('Application not found');
  return application;
};

// Agent operations
const getAllApplications = async () => {
  return await Application.findAll({
    include: [
      { model: Customer },
      {
        model: Quote,
        include: [{ model: Property }, { model: InsurancePlan }]
      },
      { model: User, as: 'reviewer', attributes: ['id', 'email'] }
    ]
  });
};

const getApplicationForReview = async (applicationId) => {
  const application = await Application.findByPk(applicationId, {
    include: [
      { model: Customer },
      {
        model: Quote,
        include: [
          { model: Property },
          { model: InsurancePlan, include: [{ model: Coverage, through: { attributes: [] } }] }
        ]
      },
      { model: User, as: 'reviewer', attributes: ['id', 'email'] }
    ]
  });

  if (!application) throw new Error('Application not found');

  // Transition to UNDER_REVIEW if it is currently SUBMITTED
  if (application.status === 'SUBMITTED') {
    await application.update({ status: 'UNDER_REVIEW' });
  }

  return application;
};

const reviewApplication = async (applicationId, agentUserId, action, reviewNotes) => {
  const application = await Application.findByPk(applicationId);
  
  if (!application) throw new Error('Application not found');
  if (['APPROVED', 'REJECTED'].includes(application.status)) {
    throw new Error('Application has already been ' + application.status.toLowerCase());
  }

  const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

  await application.update({
    status: newStatus,
    reviewed_by: agentUserId,
    review_notes: reviewNotes,
    reviewed_at: new Date()
  });

  return application;
};

module.exports = {
  submitApplication,
  getCustomerApplications,
  getCustomerApplicationById,
  getAllApplications,
  getApplicationForReview,
  reviewApplication
};
