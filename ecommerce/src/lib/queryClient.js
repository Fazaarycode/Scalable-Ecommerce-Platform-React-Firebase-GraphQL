import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 60 * 60 * 1000, // 1 hour
      refetchOnWindowFocus: false,
    },
  },
}) 