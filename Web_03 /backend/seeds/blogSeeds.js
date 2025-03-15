const mongoose = require('mongoose');
const Post = require('../models/Post');
const Category = require('../models/Category');
const User = require('../models/User');

const seedData = async () => {
  try {
    // Örnek yazar oluştur
    const author = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      bio: 'Teknoloji ve web geliştirme üzerine yazılar yazan deneyimli bir yazılımcı.'
    });

    // Örnek kategoriler
    const categories = await Category.create([
      { name: 'Teknoloji', slug: 'teknoloji' },
      { name: 'Tasarım', slug: 'tasarim' },
      { name: 'Geliştirme', slug: 'gelistirme' },
      { name: 'Haberler', slug: 'haberler' }
    ]);

    // Blog yazılarını tek tek oluştur
    const post1 = await Post.create({
      title: 'Modern Web Geliştirme Trendleri 2024',
      content: `
        <p>Modern web geliştirme sürekli evrim geçiriyor. İşte 2024'ün öne çıkan trendleri:</p>
        <h2>1. Web Components ve Micro Frontends</h2>
        <p>Modüler ve yeniden kullanılabilir bileşenler, modern web uygulamalarının temelini oluşturuyor...</p>
        <h2>2. Serverless Mimari</h2>
        <p>Serverless çözümler, ölçeklenebilirlik ve maliyet avantajlarıyla öne çıkıyor...</p>
        <h2>3. Progressive Web Apps (PWA)</h2>
        <p>PWA'lar, native uygulama deneyimini web üzerinden sunmaya devam ediyor...</p>
      `,
      excerpt: 'Web geliştirme dünyasında öne çıkan yeni teknolojiler ve yaklaşımlar hakkında detaylı bir inceleme.',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop',
      readTime: 8,
      category: categories[2]._id,
      author: author._id
    });

    const post2 = await Post.create({
      title: 'UI/UX Tasarımında Minimalizm',
      content: `
        <p>Minimalist tasarım, sadece gerekli olanı sunarak kullanıcı deneyimini optimize eder.</p>
        <h2>Minimalist Tasarımın Temel İlkeleri</h2>
        <p>1. Beyaz Alan Kullanımı<br>
        2. Tipografi Hiyerarşisi<br>
        3. Renk Paleti Seçimi<br>
        4. Grid Sistemi</p>
        <h2>Başarılı Minimalist Tasarım Örnekleri</h2>
        <p>Apple, Google ve Airbnb gibi şirketler, minimalist tasarımın gücünü başarıyla kullanıyor...</p>
      `,
      excerpt: 'Minimalist tasarım yaklaşımının modern web arayüzlerindeki önemi ve uygulama prensipleri.',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop',
      readTime: 6,
      category: categories[1]._id,
      author: author._id
    });

    const post3 = await Post.create({
      title: 'Yapay Zeka ve Web Teknolojileri',
      content: `
        <p>Yapay zeka, web teknolojilerini dönüştürmeye devam ediyor.</p>
        <h2>Web Geliştirmede AI Uygulamaları</h2>
        <p>- Otomatik Kod Optimizasyonu<br>
        - Kişiselleştirilmiş Kullanıcı Deneyimi<br>
        - Akıllı Arama Sistemleri<br>
        - Chatbot Entegrasyonları</p>
        <h2>Geleceğe Bakış</h2>
        <p>AI destekli web teknolojileri, geliştirme süreçlerini nasıl değiştirecek?</p>
      `,
      excerpt: 'Yapay zeka teknolojilerinin web geliştirme süreçlerine entegrasyonu ve gelecek perspektifi.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
      readTime: 10,
      category: categories[0]._id,
      author: author._id
    });

    console.log('Blog yazıları başarıyla eklendi!');
    process.exit(0);
  } catch (error) {
    console.error('Seed hatası:', error);
    process.exit(1);
  }
};

module.exports = seedData;