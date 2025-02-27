export const QUERIES = {
    GET_PRODUCTS: `
      query GetProducts($filter: ProductFilterInput) {
        products(filter: $filter) {
          id
          name
          price
          description
          image
          category
          stock
          discount
        }
      }
    `,
  
    GET_PRODUCT: `
      query GetProduct($id: ID!) {
        product(id: $id) {
          id
          name
          price
          description
          image
          category
          stock
          discount
        }
      }
    `,
  
    GET_USER_ORDERS: `
      query GetUserOrders {
        orders {
          id
          status
          totalPrice
          createdAt
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
  }