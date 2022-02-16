import { gql } from 'graphql-tag'

type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

// Queries
export interface ListByIdResponse {
  info: {
    _id: string
    name: string
  }
}
export const ListById = gql`
  query ListById($list_id: String!) {
    info: listById(id: $list_id) {
      _id
      name
    }
  }
`

export interface ProductsByListResponse {
  products: {
    list: {
      _id: string
      name: string
      priority: Priority
      purchased: boolean
    }[]
  }
}
export const ProductsByList = gql`
  query ProductsByList($list_id: String!) {
    products: productsByList(lsit_id: $list_id) {
      list: data {
        _id
        name
        priority
        purchased
      }
    }
  }
`
// Mutations
export interface CreateListResponse {
  created: {
    id: string
    name: string
  }
}
export const CreateList = gql`
  mutation CreateList($id: String!, $name: String!) {
    created: createList(data: { id: $id, name: $name }) {
      id
      name
    }
  }
`

export interface CreateProductResponse {
  created: {
    _id: string
    name: string
    priority: Priority
    purchased: boolean
  }
}
export const CreateProduct = gql`
  mutation CreateProduct($id: ID!, $name: String!, $priority: Priority!) {
    created: createProduct(
      data: { name: $name, priority: $priority, purchased: false, list: { connect: $id } }
    ) {
      _id
      name
      priority
      purchased
    }
  }
`

export interface DeleteProductResponse {
  deleted: {
    _id: string
    name: string
    priority: Priority
    purchased: boolean
  }
}
export const DeleteProduct = gql`
  mutation DeleteProduct($id: ID!) {
    deleted: deleteProduct(id: $id) {
      _id
      name
      priority
      purchased
    }
  }
`

export interface UpdateProductResponse {
  updated: {
    _id: string
    name: string
    priority: Priority
    purchased: boolean
  }
}
export const UpdateProduct = gql`
  mutation UpdateProduct($id: ID!, $name: String!, $priority: Priority!, $purchased: Boolean!) {
    updated: updateProduct(id: $id, data: { name: $name, priority: $priority, purchased: $purchased }) {
      _id
      name
      priority
      purchased
    }
  }
`
