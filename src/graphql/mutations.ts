import { gql } from 'graphql-tag'

export const CREATE_LIST = gql`
  mutation createList($id: String!, $name: String!) {
    list: createList(data: { id: $id, name: $name }) {
      id
      name
    }
  }
`

export const CREATE_PRODUCT = gql`
  mutation createProduct($name: String!, $priority: Priority = LOW, $quantity: Int!, $list_id: ID!) {
    product: createProduct(
      data: {
        name: $name
        priority: $priority
        purchased: false
        quantity: $quantity
        list: { connect: $list_id }
      }
    ) {
      name
      quantity
      priority
      purchased
    }
  }
`
