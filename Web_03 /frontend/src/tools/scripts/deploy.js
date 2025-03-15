const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Deploy yapılandırma seçenekleri
const deployConfig = {
  staging: {
    url: 'https://staging.example.com',
    branch: 'develop',
    env: 'staging'
  },
  production: {
    url: 'https://example.com',
    branch: 'main',
    env: 'production'
  }
};

async function deploy(environment = 'production') {
  const config = deployConfig[environment];
  
  if (!config) {
    throw new Error(`Geçersiz ortam: ${environment}`);
  }

  console.log(`🚀 ${environment} ortamına deploy başlatılıyor...`);

  try {
    // Environment değişkenlerini ayarla
    process.env.NODE_ENV = config.env;
    
    // Build işlemini çalıştır
    execSync(`node build.js ${environment}`, { stdio: 'inherit' });

    // Firebase deploy komutlarını hazırla
    const commands = [
      `firebase use ${config.env}`,
      'firebase deploy --only hosting'
    ];

    // Komutları çalıştır
    commands.forEach(command => {
      console.log(`⚙️ Çalıştırılıyor: ${command}`);
      execSync(command, { stdio: 'inherit' });
    });

    // Deploy sonrası işlemler
    postDeploy(config);

    console.log(`✅ Deploy başarıyla tamamlandı! URL: ${config.url}`);
  } catch (error) {
    console.error('❌ Deploy sırasında hata oluştu:', error);
    process.exit(1);
  }
}

function postDeploy(config) {
  // Deploy sonrası işlemler
  console.log('🔍 Deploy sonrası kontroller yapılıyor...');

  // Sürüm bilgisini güncelle
  const version = new Date().toISOString();
  const versionFile = path.join(process.cwd(), 'dist', 'version.json');
  
  fs.writeFileSync(versionFile, JSON.stringify({
    version,
    environment: config.env,
    deployedAt: new Date().toISOString()
  }, null, 2));

  // Slack bildirimi gönder
  if (process.env.SLACK_WEBHOOK_URL) {
    const message = {
      text: `🚀 *${config.env}* ortamına yeni versiyon deploy edildi!\n` +
            `• URL: ${config.url}\n` +
            `• Versiyon: ${version}\n` +
            `• Tarih: ${new Date().toLocaleString()}`
    };

    execSync(`curl -X POST -H 'Content-type: application/json' --data '${JSON.stringify(message)}' ${process.env.SLACK_WEBHOOK_URL}`);
  }
}

// Komutu çalıştır
const environment = process.argv[2] || 'production';
deploy(environment);