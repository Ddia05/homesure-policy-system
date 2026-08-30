const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coverage = sequelize.define('Coverage', {
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
  max_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  additional_premium: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'coverages',
  timestamps: false,
  underscored: true
});

module.exports = Coverage;
