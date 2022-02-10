import { gql } from 'graphql-tag'

export const GET_LIST_BY_ID = gql`
  query getListById($id: String!) {
    shopping_list: listById(id: $id) {
      _id
      id
      name
      products {
        list: data {
          name
          quantity
          priority
          purchased
        }
      }
    }
  }
`
