import { gql } from '@apollo/client/core'

// Bildirim Abonelikleri
export const NOTIFICATION_SUBSCRIPTION = gql`
  subscription OnNewNotification($userId: ID!) {
    notification(userId: $userId) {
      id
      type
      title
      message
      read
      createdAt
    }
  }
`

// Sipariş Durumu Abonelikleri
export const ORDER_STATUS_SUBSCRIPTION = gql`
  subscription OnOrderStatusChanged($orderId: ID!) {
    orderStatusChanged(orderId: $orderId) {
      id
      status
      updatedAt
    }
  }
`

// Sohbet Abonelikleri
export const CHAT_MESSAGE_SUBSCRIPTION = gql`
  subscription OnNewMessage($userId: ID!) {
    message(userId: $userId) {
      id
      content
      sender {
        id
        firstName
        lastName
        avatar
      }
      createdAt
    }
  }
`

// Stok Durumu Abonelikleri
export const STOCK_UPDATE_SUBSCRIPTION = gql`
  subscription OnStockUpdate($productId: ID!) {
    stockUpdate(productId: $productId) {
      id
      stock
      updatedAt
    }
  }
` 