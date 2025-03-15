import * as Sentry from '@sentry/vue'
import { store } from '@/store'

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      navigationTiming: {},
      resourceTiming: {},
      userTiming: {},
      vitals: {}
    }
  }

  initialize() {
    this.observeNavigationTiming()
    this.observeResourceTiming()
    this.observeUserInteractions()
    this.observeWebVitals()
  }

  observeNavigationTiming() {
    if (performance && performance.timing) {
      const timing = performance.timing
      const navigationStart = timing.navigationStart

      this.metrics.navigationTiming = {
        dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
        tcpConnection: timing.connectEnd - timing.connectStart,
        serverResponse: timing.responseEnd - timing.requestStart,
        domLoad: timing.domContentLoadedEventEnd - navigationStart,
        fullPageLoad: timing.loadEventEnd - navigationStart
      }

      this.reportMetrics('navigation', this.metrics.navigationTiming)
    }
  }

  observeResourceTiming() {
    if (performance && performance.getEntriesByType) {
      const resources = performance.getEntriesByType('resource')
      
      resources.forEach(resource => {
        const timing = {
          name: resource.name,
          duration: resource.duration,
          size: resource.transferSize,
          type: resource.initiatorType
        }

        this.metrics.resourceTiming[resource.name] = timing
      })

      this.reportMetrics('resources', this.metrics.resourceTiming)
    }
  }

  observeUserInteractions() {
    let lastInteraction = performance.now()

    document.addEventListener('click', () => {
      const now = performance.now()
      const timeSinceLastInteraction = now - lastInteraction
      
      this.metrics.userTiming.lastInteractionGap = timeSinceLastInteraction
      lastInteraction = now

      this.reportMetrics('interaction', {
        timeSinceLastInteraction
      })
    })
  }

  observeWebVitals() {
    if ('web-vital' in window) {
      window.webVitals.getCLS((metric) => {
        this.metrics.vitals.cls = metric.value
        this.reportMetrics('vitals', { cls: metric.value })
      })

      window.webVitals.getFID((metric) => {
        this.metrics.vitals.fid = metric.value
        this.reportMetrics('vitals', { fid: metric.value })
      })

      window.webVitals.getLCP((metric) => {
        this.metrics.vitals.lcp = metric.value
        this.reportMetrics('vitals', { lcp: metric.value })
      })
    }
  }

  reportMetrics(category, data) {
    // Sentry'ye gönder
    if (process.env.NODE_ENV === 'production') {
      Sentry.addBreadcrumb({
        category: `performance_${category}`,
        message: 'Performance Metric',
        data
      })
    }

    // Store'a kaydet
    store.commit('performance/UPDATE_METRICS', {
      category,
      data
    })

    // Analytics'e gönder
    if (window.analytics) {
      window.analytics.track(`Performance_${category}`, data)
    }

    // Console'a yazdır (development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metrics (${category}):`, data)
    }
  }
}

export const performanceMonitor = new PerformanceMonitor()

export const initializePerformanceMonitoring = () => {
  performanceMonitor.initialize()
}

export default performanceMonitor 