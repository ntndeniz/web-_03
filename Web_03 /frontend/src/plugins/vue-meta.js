import { createMetaManager, plugin as metaPlugin } from 'vue-meta'

export default (app) => {
  const metaManager = createMetaManager()
  app.use(metaManager)
  app.use(metaPlugin)

  // Varsayılan meta etiketleri
  app.config.globalProperties.$meta = {
    title: 'Aridolu - E-Ticaret Sitesi',
    titleTemplate: '%s | Aridolu',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: 'Aridolu e-ticaret sitesi - Güvenli ve hızlı alışveriş' },
      { name: 'keywords', content: 'e-ticaret, online alışveriş, güvenli alışveriş' },
      { property: 'og:site_name', content: 'Aridolu' },
      { property: 'og:type', content: 'website' }
    ]
  }
} 