import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { store } from '@/store'
import { captureException } from '@/config/sentry'

class XssProtection {
  constructor() {
    this.configure()
  }

  configure() {
    // DOMPurify konfigürasyonu
    DOMPurify.setConfig({
      ALLOWED_TAGS: [
        'a', 'b', 'br', 'div', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'i', 'li', 'ol', 'p', 'span', 'strong', 'ul', 'img'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'class', 'id', 'src', 'alt', 'title'
      ],
      ALLOW_DATA_ATTR: false,
      SAFE_FOR_TEMPLATES: true
    })

    // Marked konfigürasyonu
    marked.setOptions({
      sanitize: true,
      sanitizer: (dirty) => this.sanitize(dirty)
    })
  }

  sanitize(dirty, options = {}) {
    try {
      return DOMPurify.sanitize(dirty, {
        ...DOMPurify.getConfig(),
        ...options
      })
    } catch (error) {
      this.handleError(error, dirty)
      return ''
    }
  }

  sanitizeHtml(dirty) {
    return this.sanitize(dirty, {
      USE_PROFILES: { html: true }
    })
  }

  sanitizeMarkdown(dirty) {
    try {
      const html = marked(dirty)
      return this.sanitizeHtml(html)
    } catch (error) {
      this.handleError(error, dirty)
      return ''
    }
  }

  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  sanitizeUrl(url) {
    try {
      const parsed = new URL(url)
      const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:']
      
      if (!allowedProtocols.includes(parsed.protocol)) {
        return ''
      }
      
      return parsed.toString()
    } catch {
      return ''
    }
  }

  sanitizeObject(obj) {
    const sanitized = {}
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitize(value)
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value)
      } else {
        sanitized[key] = value
      }
    }
    
    return sanitized
  }

  setupVueDirective(app) {
    app.directive('sanitize', {
      beforeMount(el, binding) {
        el.innerHTML = this.sanitize(binding.value)
      },
      updated(el, binding) {
        el.innerHTML = this.sanitize(binding.value)
      }
    })
  }

  private handleError(error, input) {
    console.error('XSS koruma hatası:', error)
    captureException(error, {
      service: 'XssProtection',
      inputLength: input ? input.length : 0
    })
  }
}

export const xssProtection = new XssProtection()

export const sanitize = (input, options) => xssProtection.sanitize(input, options)
export const sanitizeHtml = (input) => xssProtection.sanitizeHtml(input)
export const sanitizeMarkdown = (input) => xssProtection.sanitizeMarkdown(input)
export const escapeHtml = (input) => xssProtection.escapeHtml(input)
export const sanitizeUrl = (input) => xssProtection.sanitizeUrl(input)

export default xssProtection 