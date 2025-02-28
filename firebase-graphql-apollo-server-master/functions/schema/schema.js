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
    inStock: Boolean
    discount: Float
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
    items: [CartItem]
    products: [Product]!
    total: Float!
    cartCount: Int
  }

  type CartItem {
    productId: ID!
    quantity: Int!
    userId: String
  }

  input ProductFilterInput {
    category: String
    minPrice: Float
    maxPrice: Float
    inStock: Boolean
  }

  type User {
    id: ID!
    email: String!
    role: String!
    createdAt: String
    lastSignIn: String
  }

  type UserClaims {
    admin: Boolean
    customClaims: String  # This will hold JSON stringified claims
  }

  type Query {
    users: [User]!
    currentUser: User
    getUserClaims(userId: ID!): UserClaims
    products(filter: ProductFilterInput): [Product!]!
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
    inStock: Boolean
    discount: Float
  }

  input ShippingAddressInput {
    street: String!
    city: String!
    state: String!
    country: String!
    zipCode: String!
  }

  type Mutation {
    setUserRole(userId: ID!, role: String!): User!
    updateUserRole(userId: ID!, role: String!): User!
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