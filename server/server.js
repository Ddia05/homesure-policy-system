const app = require('./app');
const sequelize = require('./config/database');
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Authenticate database connection without syncing/dropping tables
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

startServer();
