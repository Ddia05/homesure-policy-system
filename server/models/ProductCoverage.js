const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductCoverage = sequelize.define('ProductCoverage', {
  plan_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  coverage_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  }
}, {
  tableName: 'product_coverages',
  timestamps: false,
  underscored: true
});

module.exports = ProductCoverage;
