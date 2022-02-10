import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'

const httplink = createHttpLink({
  uri: 'https://graphql.us.fauna.com/graphql',
  headers: {
    Authorization: import.meta.env.VITE_FAUNA_TOKEN
  }
})

const cache = new InMemoryCache()

export default new ApolloClient({
  link: httplink,
  cache
})
