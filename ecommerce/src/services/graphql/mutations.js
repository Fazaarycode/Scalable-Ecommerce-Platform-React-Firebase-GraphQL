export const MUTATIONS = {
    LOGIN: `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          user {
            id
            email
            name
            role
          }
        }
      }
    `,
  
    CREATE_ORDER: `
      mutation CreateOrder($input: CreateOrderInput!) {
        createOrder(input: $input) {
          id
          status
          totalPrice
          items {
            id
            quantity
            product {
              id
              name
              price
            }
          }
        }
      }
    `,
  
    ADD_TO_CART: `
      mutation AddToCart($productId: ID!, $quantity: Int!) {
        addToCart(productId: $productId, quantity: $quantity) {
          id
          items {
            id
            quantity
            product {
              id
              name
              price
            }
          }
          totalPrice
        }
      }
    `,
  }