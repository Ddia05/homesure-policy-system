const fs = require('fs');
const path = require('path');
const modelsDir = path.join(__dirname, 'models');

if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

const models = [
  { name: 'User', table: 'users' },
  { name: 'Customer', table: 'customers' },
  { name: 'Property', table: 'properties' },
  { name: 'InsurancePlan', table: 'insurance_plans' },
  { name: 'Coverage', table: 'coverages' },
  { name: 'ProductCoverage', table: 'product_coverages' },
  { name: 'Quote', table: 'quotes' },
  { name: 'Application', table: 'applications' },
  { name: 'Policy', table: 'policies' },
  { name: 'PolicyRequest', table: 'policy_requests' }
];

models.forEach(m => {
  const content = `const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ${m.name} = sequelize.define('${m.name}', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, {
  tableName: '${m.table}',
  timestamps: false,
  underscored: true
});

module.exports = ${m.name};
`;
  fs.writeFileSync(path.join(modelsDir, m.name + '.js'), content);
});
console.log('Models generated successfully.');
