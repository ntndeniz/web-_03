import { xssProtection } from './xss'
import { captureException } from '@/config/sentry'

class Sanitizer {
  constructor() {
    this.xss = xssProtection
  }

  sanitizeInput(input, type = 'text') {
    try {
      switch (type) {
        case 'text':
          return this.sanitizeText(input)
        case 'html':
          return this.sanitizeHtml(input)
        case 'url':
          return this.sanitizeUrl(input)
        case 'email':
          return this.sanitizeEmail(input)
        case 'filename':
          return this.sanitizeFilename(input)
        default:
          return this.sanitizeText(input)
      }
    } catch (error) {
      this.handleError(error, { input, type })
      return ''
    }
  }

  sanitizeText(text) {
    if (!text) return ''
    return this.xss.sanitize(text.trim())
  }

  sanitizeHtml(html) {
    if (!html) return ''
    return this.xss.sanitizeHtml(html)
  }

  sanitizeUrl(url) {
    if (!url) return ''
    return this.xss.sanitizeUrl(url)
  }

  sanitizeEmail(email) {
    if (!email) return ''
    email = email.trim().toLowerCase()
    return email.replace(/[^a-z0-9@._-]/g, '')
  }

  sanitizeFilename(filename) {
    if (!filename) return ''
    return filename
      .trim()
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_')
  }

  sanitizeObject(obj, schema = {}) {
    try {
      const sanitized = {}
      
      for (const [key, value] of Object.entries(obj)) {
        const type = schema[key] || 'text'
        
        if (Array.isArray(value)) {
          sanitized[key] = value.map(item => 
            typeof item === 'object' 
              ? this.sanitizeObject(item, schema) 
              : this.sanitizeInput(item, type)
          )
        } else if (typeof value === 'object' && value !== null) {
          sanitized[key] = this.sanitizeObject(value, schema)
        } else {
          sanitized[key] = this.sanitizeInput(value, type)
        }
      }
      
      return sanitized
    } catch (error) {
      this.handleError(error, { object: obj })
      return {}
    }
  }

  private handleError(error, context = {}) {
    console.error('Sanitizer hatası:', error)
    captureException(error, {
      service: 'Sanitizer',
      context
    })
  }
}

export const sanitizer = new Sanitizer()

export const sanitize = (input, type) => sanitizer.sanitizeInput(input, type)
export const sanitizeObject = (obj, schema) => sanitizer.sanitizeObject(obj, schema)

export default sanitizer