import CryptoJS from 'crypto-js'
import { captureException } from '@/config/sentry'

class Encryption {
  constructor() {
    this.secretKey = process.env.VUE_APP_ENCRYPTION_KEY
    this.algorithm = 'AES'
  }

  encrypt(data) {
    try {
      if (!data) return ''
      
      const stringData = typeof data === 'object' ? JSON.stringify(data) : String(data)
      return CryptoJS[this.algorithm].encrypt(stringData, this.secretKey).toString()
    } catch (error) {
      this.handleError(error, 'encrypt')
      return ''
    }
  }

  decrypt(encryptedData) {
    try {
      if (!encryptedData) return ''
      
      const bytes = CryptoJS[this.algorithm].decrypt(encryptedData, this.secretKey)
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8)
      
      try {
        return JSON.parse(decryptedString)
      } catch {
        return decryptedString
      }
    } catch (error) {
      this.handleError(error, 'decrypt')
      return ''
    }
  }

  hashPassword(password) {
    try {
      return CryptoJS.SHA256(password).toString()
    } catch (error) {
      this.handleError(error, 'hashPassword')
      return ''
    }
  }

  generateKey(length = 32) {
    try {
      return CryptoJS.lib.WordArray.random(length).toString()
    } catch (error) {
      this.handleError(error, 'generateKey')
      return ''
    }
  }

  encryptFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const wordArray = CryptoJS.lib.WordArray.create(e.target.result)
          const encrypted = CryptoJS[this.algorithm].encrypt(wordArray, this.secretKey)
          resolve(encrypted.toString())
        } catch (error) {
          this.handleError(error, 'encryptFile')
          reject(error)
        }
      }
      
      reader.onerror = (error) => {
        this.handleError(error, 'encryptFile')
        reject(error)
      }
      
      reader.readAsArrayBuffer(file)
    })
  }

  private handleError(error, context) {
    console.error('Encryption hatası:', error)
    captureException(error, {
      service: 'Encryption',
      context
    })
  }
}

export const encryption = new Encryption()

export const encrypt = (data) => encryption.encrypt(data)
export const decrypt = (data) => encryption.decrypt(data)
export const hashPassword = (password) => encryption.hashPassword(password)
export const generateKey = (length) => encryption.generateKey(length)
export const encryptFile = (file) => encryption.encryptFile(file)

export default encryption