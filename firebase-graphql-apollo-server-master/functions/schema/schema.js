const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type ShippingAddress {
    street: String!
    city: String!
    state: String!
    country: String!
    zipCode: String!
  }

  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    image: String
    category: String!
    createdAt: String
    updatedAt: String
  }

  type Order {
    id: ID!
    userId: String!
    products: [Product!]!
    total: Float!
    status: String!
    shippingAddress: ShippingAddress!
    createdAt: String
    updatedAt: String
  }

  type Cart {
    id: ID!
    userId: String!
    products: [Product!]!
    total: Float!
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
    orders: [Order!]!
    order(id: ID!): Order
    cart(userId: String!): Cart
    cartByUserId(userId: String!): Cart
    ordersByUserId(userId: String!): [Order!]!
    productsByCategory(category: String!): [Product!]!
    searchProducts(query: String!): [Product!]!
  }

  input ProductInput {
    name: String!
    description: String
    price: Float!
    image: String
    category: String!
  }

  input ShippingAddressInput {
    street: String!
    city: String!
    state: String!
    country: String!
    zipCode: String!
  }

  type Mutation {
    addProduct(input: ProductInput!): Product!
    createProduct(
      name: String!
      description: String
      price: Float!
      image: String
      category: String!
    ): Product
    updateProduct(
      id: ID!
      name: String
      description: String
      price: Float
      image: String
      category: String
    ): Product
    deleteProduct(id: ID!): Boolean!
    createCart(userId: String!): Cart
    addToCart(
      userId: String!
      productId: ID!
      quantity: Int = 1
    ): Cart
    removeFromCart(
      userId: String!
      productId: ID!
    ): Cart
    updateCart(
      userId: String!
      productId: ID!
      action: String!
    ): Cart
    clearCart(userId: String!): Cart
    createOrder(
      userId: String!
      products: [ID!]!
      shippingAddress: ShippingAddressInput!
    ): Order
    updateOrderStatus(
      orderId: ID!
      status: String!
    ): Order
    cancelOrder(orderId: ID!): Order
  }
`;

module.exports = typeDefs; 