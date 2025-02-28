import { gql } from 'graphql-request';

export const QUERIES = {
  GET_PRODUCTS: gql`
    query GetProducts {
      products {
        id
        name
        description
        price
        discount
        image
        category
        inStock
        createdAt
        updatedAt
      }
    }
  `,
  
  GET_PRODUCT_BY_ID: gql`
    query GetProductById($id: ID!) {
      product(id: $id) {
        id
        name
        description
        price
        discount
        image
        category
        inStock
        createdAt
        updatedAt
      }
    }
  `,
  
  GET_USER_ORDERS: gql`
    query GetUserOrders {
      userOrders {
        orderId
        userId
        items {
          productId
          name
          price
          quantity
          image
        }
        total
        status
        shippingAddress {
          street
          city
          state
          zipCode
          country
        }
        createdAt
        updatedAt
      }
    }
  `,
  
  GET_CART: gql`
    query GetCart {
      cart {
        id
        items {
          id
          productId
          name
          price
          quantity
          image
        }
        total
      }
    }
  `,
  
  GET_ALL_ORDERS: gql`
    query GetAllOrders {
      allOrders {
        orderId
        userId
        userEmail
        items {
          productId
          name
          price
          quantity
          image
        }
        total
        status
        shippingAddress {
          street
          city
          state
          zipCode
          country
        }
        createdAt
        updatedAt
      }
    }
  `,
  
  GET_ALL_USERS: `
    query Users {
      users {
        id
        email
        role
        createdAt
        lastSignIn
      }
    }
  `,
  
  UPDATE_USER_ROLE: `
    mutation UpdateUserRole($userId: ID!, $role: String!) {
      updateUserRole(userId: $userId, role: $role) {
        id
        email
        role
      }
    }
  `,
  
  GET_USER_CLAIMS: `
    query GetUserClaims($userId: ID!) {
      getUserClaims(userId: $userId) {
        admin
        customClaims
      }
    }
  `,
}; 