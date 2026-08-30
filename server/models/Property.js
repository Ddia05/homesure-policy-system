const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  property_type: {
    type: DataTypes.ENUM('APARTMENT', 'INDEPENDENT_HOUSE', 'VILLA', 'TOWNHOUSE'),
    allowNull: false
  },
  property_value: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  construction_year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  construction_type: {
    type: DataTypes.ENUM('CONCRETE', 'BRICK', 'WOOD', 'MIXED'),
    allowNull: false
  },
  security_system: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  created_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'properties',
  timestamps: false,
  underscored: true
});

module.exports = Property;
