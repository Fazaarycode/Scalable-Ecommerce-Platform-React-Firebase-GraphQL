const productQueries = require('./queries/productQueries');
const cartQueries = require('./queries/cartQueries');
const orderQueries = require('./queries/orderQueries');
const productMutations = require('./mutations/productMutations');
const cartMutations = require('./mutations/cartMutations');
const orderMutations = require('./mutations/orderMutations');

const resolvers = {
  // Upload: GraphQLUpload,
  Query: {
    ...productQueries,
    ...cartQueries,
    ...orderQueries,
  },
  Mutation: {
    ...productMutations,
    ...cartMutations,
    ...orderMutations,
  }
};

module.exports = resolvers; 