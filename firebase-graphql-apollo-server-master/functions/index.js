// @ts-nocheck
const functions = require("firebase-functions");
const express = require("express");
const seedRoute = require('./routes/seedRoute');
const { seedDatabase } = require('./seeders/databaseSeeder');
const logger = require('./utils/logger');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { ApolloServerPluginLandingPageLocalDefault } = require('@apollo/server/plugin/landingPage/default');
const http = require('http');

const { db, initializeDatabase } = require('./database/database');

// Construct a schema, using GraphQL schema language
const typeDefs = require("./schema/schema");

// Provide resolver functions for your schema fields
const resolvers = require("./resolvers");

// Validate schema and resolvers match
try {
  makeExecutableSchema({
    typeDefs,
    resolvers,
    resolverValidationOptions: {
      requireResolversForArgs: true,
      requireResolversForNonScalar: true,
    }
  });
  logger.info('Schema validation passed');
} catch (error) {
  logger.error({ err: error }, 'Schema validation failed');
  throw error;
}

const app = express();

// Initialize app without IIFE
const initializeApp = async () => {
  try {
    // Create HTTP server
    const httpServer = http.createServer(app);
    
    // Create Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        ApolloServerPluginLandingPageLocalDefault({ 
          embed: true,
          includeCookies: true 
        }),
      ],
    });

    // Start Apollo Server
    await server.start();
    
    // IMPORTANT: Make sure the root path displays the GraphQL UI
    app.use(
      '/',
      express.json(),
      expressMiddleware(server, {
        context: async ({ req }) => ({ token: req.headers.token }),
      }),
    );

    // Add health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    logger.info('Apollo Server initialized successfully');
    return app;
  } catch (error) {
    logger.error('Failed to initialize app:', error);
    throw error;
  }
};

// Export the Firebase Function
exports.graphql = functions.https.onRequest(async (req, res) => {
  try {
    const initializedApp = await initializeApp();
    return initializedApp(req, res);
  } catch (error) {
    logger.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
