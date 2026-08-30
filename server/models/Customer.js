const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING
  },
  created_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'customers',
  timestamps: false,
  underscored: true
});

module.exports = Customer;
