const { Property, Quote, Policy, Customer } = require('../models');

// Helper to get customer ID from user ID
const getCustomerId = async (userId) => {
  const customer = await Customer.findOne({ where: { user_id: userId } });
  if (!customer) {
    throw new Error('Customer profile not found for this user');
  }
  return customer.id;
};

const createProperty = async (userId, data) => {
  const customerId = await getCustomerId(userId);
  return await Property.create({
    ...data,
    customer_id: customerId
  });
};

const getPropertiesByCustomer = async (userId) => {
  const customerId = await getCustomerId(userId);
  return await Property.findAll({ where: { customer_id: customerId } });
};

const getPropertyByIdAndCustomer = async (propertyId, userId) => {
  const customerId = await getCustomerId(userId);
  const property = await Property.findOne({
    where: {
      id: propertyId,
      customer_id: customerId
    }
  });

  if (!property) {
    throw new Error('Property not found or does not belong to the customer');
  }

  return property;
};

const updateProperty = async (propertyId, userId, updateData) => {
  const property = await getPropertyByIdAndCustomer(propertyId, userId);
  
  // Prevent updating customer_id or id
  delete updateData.id;
  delete updateData.customer_id;

  return await property.update(updateData);
};

const deleteProperty = async (propertyId, userId) => {
  const property = await getPropertyByIdAndCustomer(propertyId, userId);

  // Check for existing quotes or policies linked to this property
  const quoteCount = await Quote.count({ where: { property_id: propertyId } });
  const policyCount = await Policy.count({ where: { property_id: propertyId } });

  if (quoteCount > 0 || policyCount > 0) {
    throw new Error('Cannot delete property: It is linked to existing quotes or policies');
  }

  await property.destroy();
  return { success: true, message: 'Property deleted successfully' };
};

module.exports = {
  createProperty,
  getPropertiesByCustomer,
  getPropertyByIdAndCustomer,
  updateProperty,
  deleteProperty
};
