import { gql } from 'graphql-request';

export const MUTATIONS = {
  LOGIN: `
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          uid
          email
          displayName
          role
        }
      }
    }
  `,
  
  SIGNUP: `
    mutation Signup($email: String!, $password: String!, $displayName: String!) {
      signup(email: $email, password: $password, displayName: $displayName) {
        token
        user {
          uid
          email
          displayName
          role
        }
      }
    }
  `,
  
  ADD_PRODUCT: gql`
    mutation AddProduct($input: ProductInput!) {
      addProduct(input: $input) {
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
  
  UPDATE_PRODUCT: gql`
    mutation UpdateProduct($id: ID!, $input: ProductInput!) {
      updateProduct(id: $id, input: $input) {
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
  
  DELETE_PRODUCT: gql`
    mutation DeleteProduct($id: ID!) {
      deleteProduct(id: $id) {
        id
        success
        message
      }
    }
  `,
  
  ADD_TO_CART: gql`
    mutation AddToCart($productId: ID!, $quantity: Int!) {
      addToCart(productId: $productId, quantity: $quantity) {
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
        cartCount
    }
  `,
  
  REMOVE_FROM_CART: gql`
    mutation RemoveFromCart($productId: ID!) {
      removeFromCart(productId: $productId) {
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
  
  CLEAR_CART: gql`
    mutation ClearCart {
      clearCart {
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
  
  CREATE_ORDER: gql`
    mutation CreateOrder($input: OrderInput!) {
      createOrder(input: $input) {
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
      }
    }
  `,
  
  UPDATE_ORDER_STATUS: gql`
    mutation UpdateOrderStatus($orderId: ID!, $status: String!) {
      updateOrderStatus(orderId: $orderId, status: $status) {
        orderId
        status
        updatedAt
      }
    }
  `
}; 