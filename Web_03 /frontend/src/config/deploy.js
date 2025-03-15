const { execSync } = require('child_process')
const dotenv = require('dotenv')
const path = require('path')

// Ortam değişkenlerini yükle
dotenv.config()

// Deploy yapılandırması
class Deployer {
  constructor() {
    this.environment = process.env.NODE_ENV || 'development'
    this.projectId = process.env.FIREBASE_PROJECT_ID
    this.distPath = path.resolve(__dirname, '../../dist')
  }

  // Build işlemi
  async build() {
    console.log('🔨 Build başlatılıyor...')
    try {
      execSync('npm run build', { stdio: 'inherit' })
      console.log('✅ Build başarıyla tamamlandı')
    } catch (error) {
      console.error('❌ Build sırasında hata:', error)
      process.exit(1)
    }
  }

  // Firebase'e deploy
  async deployToFirebase() {
    console.log('🚀 Firebase\'e deploy başlatılıyor...')
    try {
      // Firebase projesini seç
      execSync(`firebase use ${this.projectId}`, { stdio: 'inherit' })
      
      // Hosting'e deploy et
      execSync('firebase deploy --only hosting', { stdio: 'inherit' })
      
      console.log('✅ Deploy başarıyla tamamlandı')
    } catch (error) {
      console.error('❌ Deploy sırasında hata:', error)
      process.exit(1)
    }
  }

  // Deploy işlemini başlat
  async start() {
    console.log(`🌍 ${this.environment} ortamına deploy başlatılıyor...`)
    
    // Build yap
    await this.build()
    
    // Firebase'e deploy et
    await this.deployToFirebase()
    
    console.log('🎉 Tüm işlemler başarıyla tamamlandı!')
  }
}

// Deploy işlemini başlat
const deployer = new Deployer()
deployer.start() 