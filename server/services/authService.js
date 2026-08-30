const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Customer, sequelize } = require('../models');

const registerCustomer = async (data) => {
  const { name, email, phone, address, password } = data;

  // Check if email exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Use a transaction to ensure both User and Customer are created together
  const transaction = await sequelize.transaction();
  try {
    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'CUSTOMER'
    }, { transaction });

    await Customer.create({
      user_id: user.id,
      name,
      phone,
      address
    }, { transaction });

    await transaction.commit();

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  };
};

const getUserById = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'email', 'role', 'created_at']
  });
  if (!user) throw new Error('User not found');
  
  let profile = null;
  if (user.role === 'CUSTOMER') {
    profile = await Customer.findOne({ where: { user_id: userId } });
  }
  
  return {
    user,
    profile
  };
};

module.exports = {
  registerCustomer,
  loginUser,
  getUserById
};
