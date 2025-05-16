const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Verify required environment variables
const requiredEnvs = ['MONGODB_URI'];

requiredEnvs.forEach(env => {
  if (!process.env[env]) {
    console.error(`Error: Environment variable ${env} is required`);
    process.exit(1);
  }
});