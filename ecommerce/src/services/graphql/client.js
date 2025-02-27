import { GraphQLClient } from 'graphql-request'

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql'

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    // Will be used later for authentication
    authorization: typeof window !== 'undefined' ? `Bearer ${localStorage.getItem('token')}` : '',
  },
})