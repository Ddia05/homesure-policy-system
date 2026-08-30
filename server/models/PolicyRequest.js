const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PolicyRequest = sequelize.define('PolicyRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  policy_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  request_type: {
    type: DataTypes.ENUM('ADDRESS_CHANGE', 'ADD_COVERAGE', 'REMOVE_COVERAGE', 'RENEWAL', 'CANCELLATION'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
    defaultValue: 'PENDING'
  },
  reviewed_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  requested_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  reviewed_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'policy_requests',
  timestamps: false,
  underscored: true
});

module.exports = PolicyRequest;
