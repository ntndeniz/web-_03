import { gql } from '@apollo/client/core'

// Kullanıcı Sorguları
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      role
      createdAt
      profile {
        avatar
        phone
        address
      }
    }
  }
`

export const GET_USERS = gql`
  query GetUsers($page: Int, $limit: Int) {
    users(page: $page, limit: $limit) {
      items {
        id
        name
        email
        role
        status
      }
      total
      page
      pages
    }
  }
`

// Ürün Sorguları
export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      stock
      category {
        id
        name
      }
      images
      variants {
        id
        sku
        price
        stock
      }
    }
  }
`

export const GET_PRODUCTS = gql`
  query GetProducts($filter: ProductFilter) {
    products(filter: $filter) {
      items {
        id
        name
        price
        stock
        status
      }
      total
    }
  }
`

// Sipariş Sorguları
export const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      number
      status
      total
      items {
        product {
          id
          name
        }
        quantity
        price
      }
      customer {
        id
        name
      }
    }
  }
`

// Dashboard Sorguları
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalSales
      totalOrders
      totalCustomers
      recentOrders {
        id
        number
        total
      }
      topProducts {
        id
        name
        sales
      }
    }
  }
` 