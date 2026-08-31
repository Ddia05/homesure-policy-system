const sequelize = require('./config/database');
const { 
  User, Customer, Property, Quote, 
  Application, Policy, PolicyRequest 
} = require('./models');

async function resetTestData() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    // Disable foreign key checks for truncation
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');

    console.log('Clearing test data...');
    
    // Truncate tables to reset auto-increment IDs
    await PolicyRequest.destroy({ truncate: true, cascade: false });
    await Policy.destroy({ truncate: true, cascade: false });
    await Application.destroy({ truncate: true, cascade: false });
    await Quote.destroy({ truncate: true, cascade: false });
    await Property.destroy({ truncate: true, cascade: false });
    await Customer.destroy({ truncate: true, cascade: false });
    
    // Delete only customer users to preserve agents
    await User.destroy({ where: { role: 'CUSTOMER' } });

    // Enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');

    console.log('Test data successfully cleared!');
  } catch (err) {
    console.error('Failed to reset test data:', err);
  } finally {
    await sequelize.close();
  }
}

resetTestData();
