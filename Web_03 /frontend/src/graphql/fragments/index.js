import { gql } from '@apollo/client/core'

// Kullanıcı Fragment'leri
export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    email
    firstName
    lastName
    avatar
    role
    createdAt
    updatedAt
  }
`

// Ürün Fragment'leri
export const PRODUCT_FRAGMENT = gql`
  fragment ProductFields on Product {
    id
    name
    slug
    description
    price
    discountedPrice
    stock
    images
    category {
      id
      name
    }
    createdAt
    updatedAt
  }
`

// Sipariş Fragment'leri
export const ORDER_FRAGMENT = gql`
  fragment OrderFields on Order {
    id
    orderNumber
    status
    totalAmount
    items {
      id
      quantity
      price
      product {
        id
        name
        image
      }
    }
    user {
      id
      firstName
      lastName
    }
    createdAt
  }
`

// Adres Fragment'leri
export const ADDRESS_FRAGMENT = gql`
  fragment AddressFields on Address {
    id
    title
    firstName
    lastName
    phone
    address
    city
    district
    zipCode
    isDefault
  }
` 