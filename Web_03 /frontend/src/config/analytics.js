import Analytics from 'analytics'
import googleAnalytics from '@analytics/google-analytics'
import segmentPlugin from '@analytics/segment'

const analytics = Analytics({
  app: 'e-commerce-app',
  debug: process.env.NODE_ENV !== 'production',
  plugins: [
    googleAnalytics({
      trackingId: process.env.VUE_APP_GA_TRACKING_ID
    }),
    segmentPlugin({
      writeKey: process.env.VUE_APP_SEGMENT_WRITE_KEY
    })
  ]
})

export const initAnalytics = () => {
  analytics.page()
}

export const trackEvent = (eventName, properties = {}) => {
  analytics.track(eventName, {
    ...properties,
    timestamp: new Date().toISOString()
  })
}

export const identifyUser = (userId, traits = {}) => {
  analytics.identify(userId, {
    ...traits,
    lastUpdated: new Date().toISOString()
  })
}

export const setUserProperties = (properties) => {
  analytics.setUserProperties(properties)
}

export default analytics 