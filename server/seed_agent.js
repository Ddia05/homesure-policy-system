require('dotenv').config();
const bcrypt = require('bcryptjs');
const { User, sequelize } = require('./models');

async function seedAgent() {
  try {
    // Authenticate and sync models if necessary (we assume tables exist)
    await sequelize.authenticate();
    
    const email = process.env.AGENT_EMAIL || 'agent@homesure.com';
    const password = process.env.AGENT_PASSWORD || 'agent123';

    const existingAgent = await User.findOne({ where: { email } });
    
    if (existingAgent) {
      console.log(`Agent account with email ${email} already exists.`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
      role: 'AGENT'
    });

    console.log(`Successfully created test AGENT account: ${email}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding agent:', error);
    process.exit(1);
  }
}

seedAgent();
