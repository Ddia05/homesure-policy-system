const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InsurancePlan = sequelize.define('InsurancePlan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  base_premium: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'insurance_plans',
  timestamps: false,
  underscored: true
});

module.exports = InsurancePlan;
