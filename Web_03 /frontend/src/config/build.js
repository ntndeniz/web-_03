const path = require('path')
const webpack = require('webpack')
const { defineConfig } = require('@vue/cli-service')

// Build yapılandırması
module.exports = defineConfig({
  // Build çıktı dizini
  outputDir: path.resolve(__dirname, '../../dist'),

  // Asset'ler için dizin
  assetsDir: 'assets',

  // Source maps
  productionSourceMap: false,

  // Webpack yapılandırması
  configureWebpack: {
    plugins: [
      // Ortam değişkenlerini tanımla
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          VUE_APP_API_URL: JSON.stringify(process.env.VUE_APP_API_URL),
          VUE_APP_FIREBASE_CONFIG: JSON.stringify(process.env.VUE_APP_FIREBASE_CONFIG)
        }
      })
    ],
    optimization: {
      // Chunk'ları böl
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 250000
      }
    }
  },

  // CSS yapılandırması
  css: {
    extract: true,
    sourceMap: false
  },

  // Dev server yapılandırması
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_URL,
        changeOrigin: true
      }
    }
  }
}) 