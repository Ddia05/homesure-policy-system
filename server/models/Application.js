const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quote_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'),
    defaultValue: 'SUBMITTED'
  },
  reviewed_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  review_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  submitted_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  reviewed_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'applications',
  timestamps: false,
  underscored: true
});

module.exports = Application;
