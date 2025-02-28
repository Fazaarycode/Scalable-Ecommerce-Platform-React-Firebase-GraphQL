// @ts-nocheck
const functions = require("firebase-functions");
const express = require("express");
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginLandingPageLocalDefault } = require('@apollo/server/plugin/landingPage/default');
const logger = require('./utils/logger');
const admin = require('./database/database');

// Import schema and resolvers
const typeDefs = require("./schema/schema");
const resolvers = require("./resolvers");

// Import database (already initialized in the module)
const { db } = require('./database/database');

// Create an Express app
const app = express();

// Create a separate router for handling OPTIONS preflight requests
const preflightRouter = express.Router();
preflightRouter.options('*', (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Apollo-Require-Preflight');
  res.set('Access-Control-Max-Age', '3600');
  res.status(204).send('');
});

// Use the preflight router first
app.use(preflightRouter);

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Apollo-Require-Preflight'],
  credentials: true
}));

// Create Apollo Server
let server;
let serverInitialized = false;

const initializeServer = async () => {
  if (!serverInitialized) {
    server = new ApolloServer({
      typeDefs,
      resolvers,
      context: async ({ req }) => {
        // Get the user token from the headers
        const token = req.headers.authorization || '';
        
        try {
          // Verify the token and get user info
          const decodedToken = await admin.auth().verifyIdToken(token);
          return { userId: decodedToken.uid };
        } catch (error) {
          console.error('Error verifying token:', error);
          return { userId: null };
        }
      },
      introspection: true,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({ 
          embed: true,
          includeCookies: true 
        }),
      ],
    });
    
    await server.start();
    
    // Apply Apollo middleware
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
    
    serverInitialized = true;
    logger.info('Apollo Server initialized successfully');
  }
  
  return app;
};

// Export the Firebase Function with special handling for OPTIONS
exports.graphql = functions.https.onRequest(async (req, res) => {
  // Special handling for OPTIONS requests
  if (req.method === 'OPTIONS') {
    // Set CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Apollo-Require-Preflight');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }
  
  try {
    const appInstance = await initializeServer();
    return appInstance(req, res);
  } catch (error) {
    logger.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
