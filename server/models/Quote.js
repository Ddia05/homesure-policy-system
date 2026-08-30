const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quote = sequelize.define('Quote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  property_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  plan_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  premium: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  risk_score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  risk_level: {
    type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('GENERATED', 'ACCEPTED', 'REJECTED'),
    defaultValue: 'GENERATED'
  },
  created_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'quotes',
  timestamps: false,
  underscored: true
});

module.exports = Quote;
