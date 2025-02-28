const productQueries = require('./queries/productQueries');
const productMutations = require('./mutations/productMutations');
const cartQueries = require('./queries/cartQueries');
const cartMutations = require('./mutations/cartMutations');
const orderQueries = require('./queries/orderQueries');
const orderMutations = require('./mutations/orderMutations');
const userQueries = require('./queries/userQueries');
const userMutations = require('./mutations/userMutations');

const resolvers = {
  // Upload: GraphQLUpload,
  Query: {
    ...productQueries,
    ...cartQueries,
    ...orderQueries,
    ...userQueries,
  },
  Mutation: {
    ...productMutations,
    ...cartMutations,
    ...orderMutations,
    ...userMutations,
  }
};

module.exports = resolvers; 