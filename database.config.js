// Database configuration for different environments
const { PrismaClient } = require('@prisma/client');

// Determine the database provider based on environment
const getDatabaseUrl = () => {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  return databaseUrl;
};

// Create Prisma client with appropriate configuration
const createPrismaClient = () => {
  const databaseUrl = getDatabaseUrl();
  
  // Configure connection pooling and other options based on environment
  const isProduction = process.env.NODE_ENV === 'production';
  
  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: isProduction ? ['error'] : ['query', 'info', 'warn', 'error'],
  });
};

module.exports = {
  createPrismaClient,
  getDatabaseUrl,
};
