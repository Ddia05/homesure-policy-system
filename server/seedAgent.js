const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

const sequelize = new Sequelize('homesure_db', 'root', 'ddia05', {
  host: '127.0.0.1',
  dialect: 'mysql',
  logging: false
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'users',
  timestamps: false,
  underscored: true
});

async function seedAgent() {
  try {
    await sequelize.authenticate();
    const hash = await bcrypt.hash('password123', 10);
    const [user, created] = await User.findOrCreate({
      where: { email: 'agent@example.com' },
      defaults: {
        password: hash,
        role: 'AGENT',
        created_at: new Date()
      }
    });
    
    if (created) {
      console.log('Agent created successfully: agent@example.com / password123');
    } else {
      console.log('Agent already exists.');
    }
  } catch (err) {
    console.error('Error seeding agent:', err);
  } finally {
    await sequelize.close();
  }
}

seedAgent();
