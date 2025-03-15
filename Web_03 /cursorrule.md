# Proje Kuralları ve Yapısı
# Bu dosya, projenin tüm kurallarını, mimari yapısını, performans önerilerini, dosya yapısını ve kullanılması gereken bileşenleri içerir.

## Genel Kurallar
1. **Kod Dili**: 
   - Kod yazarken her zaman **Türkçe** açıklamalar kullanılmalıdır.
   - Değişken ve fonksiyon isimleri İngilizce olmalıdır.

2. **Kod Tekrarı**:
   - DRY (Don't Repeat Yourself) prensibi uygulanmalıdır.
   - Tekrar eden kod blokları fonksiyonlara veya yardımcı modüllere taşınmalıdır.

3. **Gizli Bilgiler**:
   - Tüm API anahtarları, şifreler ve gizli bilgiler `.env` dosyasında saklanmalıdır.
   - `.env` dosyası `.gitignore` içine eklenmeli ve asla versiyon kontrolüne dahil edilmemelidir.

4. **Kod Kalitesi**:
   - Kodlar temiz, okunabilir ve anlaşılır olmalıdır.
   - Gereksiz karmaşıklıktan kaçınılmalıdır.

5. **Görsellerin Bulunması**:
   - Görseller, internetten telif hakkı sorunu olmayan kaynaklardan temin edilmelidir.
   - Önerilen kaynaklar: Unsplash, Pexels, Pixabay.
   - Görseller modern formatlarda (WebP, AVIF) ve sıkıştırılmış olmalıdır.
   - Görseller `frontend/public/images/` klasöründe veya Firebase Storage'da `images/` klasöründe tutulmalıdır.

## Mimari Yapı
1. **Monolitik Mimari**:
   - Proje, monolitik bir yapıda geliştirilecektir.
   - Frontend ve backend ayrı ayrı geliştirilecek ancak aynı proje içinde tutulacaktır.

2. **Katmanlı Mimari**:
   - **Presentation Layer (Sunum Katmanı)**: Frontend (Vue.js + Tailwind CSS).
   - **Application Layer (Uygulama Katmanı)**: Backend (Node.js + Express).
   - **Data Layer (Veri Katmanı)**: Firestore ve PostgreSQL.

3. **Modüler Yapı**:
   - Her bir modül (örneğin, kullanıcı yönetimi, ürün yönetimi) kendi klasöründe tutulacak ve bağımsız çalışacak şekilde tasarlanacaktır.

## Frontend Mimarisi (Vue.js + Tailwind CSS)
1. **Component-Based Architecture**:
   - Tüm bileşenler modüler ve yeniden kullanılabilir olacak şekilde tasarlanmalıdır.
   - Bileşenler arasında veri akışı `props` ve `events` ile sağlanmalıdır.

2. **State Management**:
   - Vuex kullanılarak global state yönetimi sağlanmalıdır.
   - State'ler modüler bir şekilde yönetilmeli (Örnek: `auth.js`, `cart.js`).

3. **Routing**:
   - Vue Router kullanılarak sayfalar arası geçişler yönetilmelidir.
   - Tüm route'lar `src/router/` klasöründe tutulmalıdır.

4. **API İletişimi**:
   - Axios kullanılarak backend API'leri ile iletişim sağlanmalıdır.
   - Tüm API istekleri `src/services/` klasöründe organize edilmelidir.

## Backend Mimarisi (Node.js + Express)
1. **RESTful API**:
   - Backend, RESTful API standartlarına uygun olarak geliştirilecektir.
   - Tüm endpoint'ler dokümante edilmeli ve Swagger ile desteklenmelidir.

2. **Middleware Kullanımı**:
   - Güvenlik için `Helmet.js` ve `Rate Limiting` kullanılmalıdır.
   - Tüm istekler için CORS ayarları yapılmalıdır.

3. **Veritabanı Yönetimi**:
   - PostgreSQL, ana veritabanı olarak kullanılacaktır.
   - Firestore, real-time veri ihtiyaçları için kullanılacaktır.
   - Tüm sorgular `src/models/` klasöründe tutulmalıdır.

4. **Loglama ve Hata Yönetimi**:
   - Tüm kritik işlemler loglanmalıdır.
   - Hatalar, merkezi bir hata takip sistemi (örneğin Sentry) ile izlenmelidir.

## Firebase Mimarisi (Firestore + Storage + Functions)
1. **Firestore**:
   - Firestore, real-time veri ihtiyaçları için kullanılacaktır.
   - Koleksiyon isimleri küçük harf ve kısa olmalıdır (Örnek: `users`, `products`).

2. **Storage**:
   - Resimler `images/` klasöründe, belgeler `documents/` klasöründe tutulmalıdır.
   - Dosya isimleri anlamlı ve benzersiz olmalıdır.

3. **Functions**:
   - Firebase Functions, backend işlemleri için kullanılacaktır.
   - Tüm fonksiyonlar `index.js` dosyasında organize edilmelidir.

## Performans Kuralları
1. **Frontend Performans**:
   - Görseller sıkıştırılmış ve modern formatlarda (WebP, AVIF) kullanılmalıdır.
   - Lazy loading (geç yükleme) ile görseller sadece ihtiyaç duyulduğunda yüklenmelidir.
   - Büyük JavaScript dosyaları, kod bölme (code splitting) ile küçük parçalara ayrılmalıdır.

2. **Backend Performans**:
   - Veritabanı sorguları optimize edilmeli ve gereksiz sorgulardan kaçınılmalıdır.
   - Sık erişilen veriler için Redis veya benzeri bir caching mekanizması kullanılmalıdır.

3. **Firebase Performans**:
   - Sık erişilen veriler için Firestore önbelleği kullanılmalıdır.
   - Büyük dosyalar parçalara ayrılarak yüklenmeli (chunk upload) ve gereksiz yükleme işlemlerinden kaçınılmalıdır.

## Dosya Yapısı
1. **Frontend**:
   - `frontend/`: Vue.js ve Tailwind CSS ile geliştirilen frontend kısmı.
     - `public/`: Statik dosyalar (CSS, JS, resimler).
     - `src/`: Vue.js uygulama dosyaları.
       - `assets/`: Varlıklar (resimler, ikonlar, vs.).
       - `components/`: Tüm bileşenler.
         - `common/`: Ortak bileşenler (Header, Footer, vs.).
         - `home/`: Ana sayfa bileşenleri.
         - `product/`: Ürün sayfaları bileşenleri.
         - `cart/`: Sepet sayfası bileşenleri.
         - `user/`: Kullanıcı paneli bileşenleri.
       - `views/`: Sayfa bileşenleri.
       - `services/`: API servisleri.
       - `store/`: Vuex store (state yönetimi).
       - `router/`: Vue Router yapısı.
       - `App.vue`: Ana uygulama bileşeni.
       - `main.js`: Uygulama giriş noktası.
     - `tailwind.config.js`: Tailwind CSS yapılandırması.
     - `vue.config.js`: Vue.js yapılandırması.
     - `package.json`: Bağımlılıklar ve script'ler.

2. **Backend**:
   - `backend/`: Node.js ve Express ile geliştirilen backend kısmı.
     - `src/`: Backend uygulama dosyaları.
       - `auth/`: Kimlik doğrulama modülü.
       - `products/`: Ürün yönetimi modülü.
       - `orders/`: Sipariş yönetimi modülü.
       - `payments/`: Ödeme modülü.
       - `utils/`: Yardımcı fonksiyonlar.
       - `middleware/`: Middleware'ler (Helmet.js, Rate Limiting).
       - `config/`: Yapılandırma dosyaları.
       - `models/`: Veritabanı modelleri.
       - `migrations/`: Veritabanı migrasyonları.
       - `seeders/`: Veritabanı seed'leri.
       - `app.js`: Ana uygulama dosyası.
       - `server.js`: Sunucu giriş noktası.
     - `.env`: Çevresel değişkenler.
     - `package.json`: Bağımlılıklar ve script'ler.
     - `README.md`: Proje dokümantasyonu.

3. **Firebase**:
   - `firebase/`: Firebase Functions, Firestore ve Storage yapısı.
     - `functions/`: Firebase Functions.
       - `index.js`: Functions giriş noktası.
       - `auth.js`: Kimlik doğrulama functions.
       - `payments.js`: Ödeme functions.
       - `notifications.js`: Bildirim functions.
     - `firestore/`: Firestore veritabanı yapısı.
       - `users/`: Kullanıcı koleksiyonu.
       - `products/`: Ürün koleksiyonu.
       - `orders/`: Sipariş koleksiyonu.
       - `logs/`: Log koleksiyonu.
     - `storage/`: Firebase Storage yapısı.
       - `images/`: Ürün resimleri.
       - `documents/`: Belgeler (PDF, vs.).
     - `.firebaserc`: Firebase yapılandırması.
     - `firebase.json`: Firebase deploy ayarları.
     - `README.md`: Firebase dokümantasyonu.

4. **Global Dosyalar**:
   - `.env`: Global çevresel değişkenler.
   - `.gitignore`: Git ignore dosyası.
   - `package.json`: Global bağımlılıklar ve script'ler.
   - `README.md`: Proje dokümantasyonu.

## Kullanılması Gereken Bileşenler
1. **Frontend Bileşenleri**:
   - `Header.vue`, `Footer.vue`, `NavigationMenu.vue`, `SearchBar.vue`, `NotificationCenter.vue`, `BackToTop.vue`.
   - `ProductCarousel.vue`, `ProductRecommendations.vue`, `DiscountCountdown.vue`, `TopSellers.vue`, `FlashSale.vue`, `RecentlyViewed.vue`.
   - `ProductCard.vue`, `ProductFilter.vue`, `ProductDetail.vue`, `ProductImageGallery.vue`, `ProductSpecifications.vue`, `ProductReviews.vue`, `ProductVariants.vue`, `ProductShare.vue`.
   - `ShoppingCart.vue`, `DiscountCoupon.vue`, `OrderSummary.vue`, `ProceedToCheckout.vue`.
   - `UserDashboard.vue`, `OrderHistory.vue`, `PasswordUpdate.vue`, `AddressManagement.vue`, `Logout.vue`.
   - `BlogPostCard.vue`, `BlogPostDetail.vue`, `CommentSection.vue`, `AuthorBio.vue`, `RelatedPosts.vue`.
   - `PrivacyPolicy.vue`, `TermsOfService.vue`, `CookiePolicy.vue`, `ReturnPolicy.vue`, `MembershipTerms.vue`.

2. **Backend Bileşenleri**:
   - `authController.js`, `authMiddleware.js`.
   - `productController.js`, `productModel.js`.
   - `orderController.js`, `orderModel.js`.
   - `paymentController.js`, `paymentModel.js`.

3. **Firebase Bileşenleri**:
   - `auth.js`, `payments.js`, `notifications.js`.

## Kurulum Adımları
1. **Frontend Kurulumu**:
   - `frontend/` klasörüne gidin ve bağımlılıkları yükleyin:
     ```bash
     cd frontend
     npm install
     npm run serve
     ```

2. **Backend Kurulumu**:
   - `backend/` klasörüne gidin ve bağımlılıkları yükleyin:
     ```bash
     cd backend
     npm install
     npm start
     ```

3. **Firebase Kurulumu**:
   - `firebase/` klasörüne gidin ve Firebase CLI'yi yükleyin:
     ```bash
     cd firebase
     npm install -g firebase-tools
     firebase login
     cd functions
     npm install
     firebase deploy
     ```

4. **Global Kurulum**:
   - Proje kök dizininde bağımlılıkları yükleyin:
     ```bash
     npm install
     ```


- Tüm kurallara ve mimari yapıya uyulmalıdır.
- Herhangi bir sorun veya öneri için proje yöneticisiyle iletişime geçilmelidir.
- Projeyi geliştirirken her zaman en son sürümü kontrol edin.
- Projeyi geliştirirken frontend dosyasındaki Bitti.txt dosyasını kontrol et ve Oluşturulacak Yeni Dosyalar bölümündeki dosyalar oluşturulsun.
- Projeyi geiştirirken frontend dosyasındaki Oluşturulacak Yeni Dosyalar bölümündeki her 6 dosyayı oluşturdukta sonra Bitti.txt dosyasını güncelle.
- Projeyi geliştirirken frontend dosyasındaki Bitti.txt dosyasını kontrol et ve Oluşturulacak Yeni Dosyalar bölümündeki dosyal
- Projeyi geliştirirken backend dosyasındaki Bitti2.txt dosyasını kontrol et.
- Oluşturulacak Dosyalar bölümündeki dosyaların yanına oluşturulduktan sonra tik işareti koyarak güncelle.
- Oluşturulacak dosyalar bölümünde olmayan bir dosya oluşturulduğunda dosya konumunu doğru bir şekilde Btti2.txt dosyasına kaydet ve dosyayı güncelle. 