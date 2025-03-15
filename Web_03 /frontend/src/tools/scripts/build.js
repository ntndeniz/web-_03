const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Build yapılandırma seçenekleri
const buildConfig = {
  development: {
    env: 'development',
    analyze: false,
    sourcemaps: true,
    optimization: false
  },
  staging: {
    env: 'staging',
    analyze: true,
    sourcemaps: true,
    optimization: true
  },
  production: {
    env: 'production',
    analyze: true,
    sourcemaps: false,
    optimization: true
  }
};

function build(environment = 'production') {
  const config = buildConfig[environment];
  
  if (!config) {
    throw new Error(`Geçersiz ortam: ${environment}`);
  }

  console.log(`🚀 ${environment} ortamı için build başlatılıyor...`);

  try {
    // Environment değişkenlerini ayarla
    process.env.NODE_ENV = config.env;
    process.env.VUE_APP_ENV = config.env;

    // Build komutlarını hazırla
    const commands = [
      'vue-cli-service lint',
      `cross-env NODE_ENV=${config.env} vue-cli-service build`,
    ];

    if (config.analyze) {
      commands.push('webpack-bundle-analyzer dist/stats.json');
    }

    // Build öncesi temizlik
    if (fs.existsSync('dist')) {
      fs.rmSync('dist', { recursive: true });
    }

    // Komutları çalıştır
    commands.forEach(command => {
      console.log(`⚙️ Çalıştırılıyor: ${command}`);
      execSync(command, { stdio: 'inherit' });
    });

    // Build sonrası işlemler
    postBuild(config);

    console.log('✅ Build başarıyla tamamlandı!');
  } catch (error) {
    console.error('❌ Build sırasında hata oluştu:', error);
    process.exit(1);
  }
}

function postBuild(config) {
  // Build sonrası optimizasyonlar
  if (config.optimization) {
    console.log('🔧 Optimizasyonlar uygulanıyor...');
    
    // Gereksiz dosyaları temizle
    const unnecessaryFiles = [
      'dist/stats.json',
      'dist/stats.html'
    ];
    
    unnecessaryFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });

    // Dosya boyutlarını raporla
    const distPath = path.join(process.cwd(), 'dist');
    const files = fs.readdirSync(distPath);
    
    console.log('\nDosya boyutları:');
    files.forEach(file => {
      const filePath = path.join(distPath, file);
      const stats = fs.statSync(filePath);
      console.log(`${file}: ${(stats.size / 1024).toFixed(2)} KB`);
    });
  }
}

// Komutu çalıştır
const environment = process.argv[2] || 'production';
build(environment); 