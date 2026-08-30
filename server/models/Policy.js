const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Policy = sequelize.define('Policy', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  policy_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  application_id: {
    type: DataTypes.INTEGER,
    allowNull: false
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
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'EXPIRED', 'CANCELLED'),
    defaultValue: 'ACTIVE'
  },
  created_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'policies',
  timestamps: false,
  underscored: true
});

module.exports = Policy;
