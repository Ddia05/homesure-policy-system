const sequelize = require('../config/database');

const User = require('./User');
const Customer = require('./Customer');
const Property = require('./Property');
const InsurancePlan = require('./InsurancePlan');
const Coverage = require('./Coverage');
const ProductCoverage = require('./ProductCoverage');
const Quote = require('./Quote');
const Application = require('./Application');
const Policy = require('./Policy');
const PolicyRequest = require('./PolicyRequest');

// User <-> Customer
User.hasOne(Customer, { foreignKey: 'user_id' });
Customer.belongsTo(User, { foreignKey: 'user_id' });

// Customer <-> Property
Customer.hasMany(Property, { foreignKey: 'customer_id' });
Property.belongsTo(Customer, { foreignKey: 'customer_id' });

// Customer <-> Quote
Customer.hasMany(Quote, { foreignKey: 'customer_id' });
Quote.belongsTo(Customer, { foreignKey: 'customer_id' });

// Customer <-> Application
Customer.hasMany(Application, { foreignKey: 'customer_id' });
Application.belongsTo(Customer, { foreignKey: 'customer_id' });

// Customer <-> Policy
Customer.hasMany(Policy, { foreignKey: 'customer_id' });
Policy.belongsTo(Customer, { foreignKey: 'customer_id' });

// Property <-> Quote
Property.hasMany(Quote, { foreignKey: 'property_id' });
Quote.belongsTo(Property, { foreignKey: 'property_id' });

// Property <-> Policy
Property.hasMany(Policy, { foreignKey: 'property_id' });
Policy.belongsTo(Property, { foreignKey: 'property_id' });

// InsurancePlan <-> Quote
InsurancePlan.hasMany(Quote, { foreignKey: 'plan_id' });
Quote.belongsTo(InsurancePlan, { foreignKey: 'plan_id' });

// InsurancePlan <-> Policy
InsurancePlan.hasMany(Policy, { foreignKey: 'plan_id' });
Policy.belongsTo(InsurancePlan, { foreignKey: 'plan_id' });

// InsurancePlan <-> Coverage (through ProductCoverage)
InsurancePlan.belongsToMany(Coverage, { through: ProductCoverage, foreignKey: 'plan_id' });
Coverage.belongsToMany(InsurancePlan, { through: ProductCoverage, foreignKey: 'coverage_id' });

ProductCoverage.belongsTo(InsurancePlan, { foreignKey: 'plan_id' });
ProductCoverage.belongsTo(Coverage, { foreignKey: 'coverage_id' });

// Quote <-> Application
Quote.hasOne(Application, { foreignKey: 'quote_id' });
Application.belongsTo(Quote, { foreignKey: 'quote_id' });

// Application <-> Policy
Application.hasOne(Policy, { foreignKey: 'application_id' });
Policy.belongsTo(Application, { foreignKey: 'application_id' });

// Policy <-> PolicyRequest
Policy.hasMany(PolicyRequest, { foreignKey: 'policy_id' });
PolicyRequest.belongsTo(Policy, { foreignKey: 'policy_id' });

// Reviewer Associations (User <-> Application, User <-> PolicyRequest)
User.hasMany(Application, { foreignKey: 'reviewed_by', as: 'reviewedApplications' });
Application.belongsTo(User, { foreignKey: 'reviewed_by', as: 'reviewer' });

User.hasMany(PolicyRequest, { foreignKey: 'reviewed_by', as: 'reviewedPolicyRequests' });
PolicyRequest.belongsTo(User, { foreignKey: 'reviewed_by', as: 'reviewer' });

module.exports = {
  sequelize,
  User,
  Customer,
  Property,
  InsurancePlan,
  Coverage,
  ProductCoverage,
  Quote,
  Application,
  Policy,
  PolicyRequest
};
