import { graphqlClient } from './graphql/client'
import { QUERIES } from './graphql/queries'
import { MUTATIONS } from './graphql/mutations'

export const api = {
  // Products
  getProducts: async (filters = {}) => {
    return graphqlClient.request(QUERIES.GET_PRODUCTS, { filter: filters })
  },

  getProduct: async (id) => {
    return graphqlClient.request(QUERIES.GET_PRODUCT, { id })
  },

  // Auth
  login: async (email, password) => {
    return graphqlClient.request(MUTATIONS.LOGIN, { email, password })
  },

  // Orders
  createOrder: async (orderInput) => {
    return graphqlClient.request(MUTATIONS.CREATE_ORDER, { input: orderInput })
  },

  getUserOrders: async () => {
    return graphqlClient.request(QUERIES.GET_USER_ORDERS)
  },

  // Cart
  addToCart: async (productId, quantity) => {
    return graphqlClient.request(MUTATIONS.ADD_TO_CART, { productId, quantity })
  },
}