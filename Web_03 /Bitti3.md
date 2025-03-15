# Frontend-Backend Entegrasyon Yol Haritası

## 0. Temel Kavramlar ve Prensipler

### HTTP İletişimi
```
Frontend (İstemci) <--HTTP/HTTPS--> Backend (Sunucu)

GET     /api/users      -> Kullanıcıları listele
POST    /api/users      -> Yeni kullanıcı oluştur
PUT     /api/users/:id  -> Kullanıcı güncelle
DELETE  /api/users/:id  -> Kullanıcı sil
```

### REST API Prensipleri
- Durumsuzluk (Stateless)
- Önbelleğe Alınabilirlik (Cacheability)
- Katmanlı Sistem (Layered System)
- Tekdüze Arayüz (Uniform Interface)

### Örnek API Endpoint Yapısı
```
/api/v1/                 -> API versiyonu
   ├── auth/             -> Kimlik doğrulama
   │   ├── login        -> Giriş
   │   ├── register     -> Kayıt
   │   └── logout       -> Çıkış
   │
   ├── users/           -> Kullanıcı işlemleri
   │   ├── profile     -> Profil
   │   └── settings    -> Ayarlar
   │
   └── products/        -> Ürün işlemleri
       ├── list        -> Liste
       └── details     -> Detay
```

## 1. API İletişim Katmanı

### API İstemci Yapılandırması (Frontend)
1. src/services/api/
   - axios.config.js (Base URL, interceptors, timeout ayarları)
   - api.service.js (Temel API metodları)
   - auth.interceptor.js (Token yönetimi)
   - error.interceptor.js (Hata yönetimi)

### API Endpoint Yapılandırması (Backend)
1. src/api/
   - routes.js (API rotaları)
   - middleware/ (API middleware'leri)
   - controllers/ (İstek işleyicileri)
   - validators/ (İstek doğrulayıcıları)

## 2. Güvenlik Entegrasyonu

### Frontend Güvenlik
1. Token Yönetimi
   - JWT storage ve yenileme
   - Authorization header yönetimi
   - Token yaşam döngüsü

2. Güvenlik Kontrolleri
   - XSS koruması
   - CSRF token yönetimi
   - Input sanitization

### Backend Güvenlik
1. Authentication
   - JWT doğrulama
   - Session yönetimi
   - Rate limiting

2. Authorization
   - Role tabanlı erişim kontrolü
   - Permission checks
   - API gateway koruması

## 3. Gerçek Zamanlı İletişim

### WebSocket Bağlantısı
1. Frontend WebSocket
   - socket.service.js (Socket.io client)
   - event-handlers/
   - connection-manager.js

2. Backend WebSocket
   - WebSocketServer.js
   - event-handlers/
   - room-manager.js

### Event Sistemi
1. Frontend Events
   - eventBus.js
   - event-types.js
   - subscribers/

2. Backend Events
   - EventEmitter.js
   - event-handlers/
   - publishers/

## 4. State Senkronizasyonu

### Frontend State Management
1. Vuex Store
   - modules/
   - actions/ (API çağrıları)
   - mutations/ (State güncellemeleri)
   - getters/ (State okuma)

### Backend State Management
1. Cache Layer
   - Redis cache
   - Memory cache
   - Cache invalidation

## 5. Error Handling

### Frontend Error Handling
1. Global Error Handler
   - error-types.js
   - error-handlers/
   - error-reporting.js

### Backend Error Handling
1. Error Middleware
   - error-handlers/
   - error-formatters/
   - error-logging.js

## 6. Data Flow

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │         │  API Gateway │         │   Backend   │
│   (Vue.js)  │ ──────> │   (Express)  │ ──────> │  (Node.js)  │
└─────────────┘         └──────────────┘         └─────────────┘
      ↑                       ↑                        ↑
      │                       │                        │
      │                       │                        │
      └───────────────────────┼────────────────────────┘
                    WebSocket/Events
```

## 7. Entegrasyon Kontrol Listesi

### Frontend Hazırlıkları
- [ ] API servis katmanı kurulumu
- [ ] Token yönetim sistemi
- [ ] WebSocket bağlantı yönetimi
- [ ] Global error handling
- [ ] State management yapılandırması
- [ ] Loading state yönetimi
- [ ] Form validation sistemi
- [ ] File upload yönetimi

### Backend Hazırlıkları
- [ ] API endpoint yapılandırması
- [ ] Authentication sistemi
- [ ] Authorization kontrolleri
- [ ] WebSocket server kurulumu
- [ ] Rate limiting
- [ ] CORS yapılandırması
- [ ] Validation middleware
- [ ] Error handling middleware

### Test ve Doğrulama
- [ ] API endpoint testleri
- [ ] WebSocket bağlantı testleri
- [ ] Authentication flow testleri
- [ ] Error handling testleri
- [ ] Performance testleri
- [ ] Security testleri

## 8. Örnek Entegrasyon Kodları

### Frontend API Çağrısı
```javascript
// api.service.js
import axios from 'axios';

const ApiService = {
  init(baseURL) {
    axios.defaults.baseURL = baseURL;
    axios.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  },
  
  get(resource) {
    return axios.get(resource);
  },
  
  post(resource, data) {
    return axios.post(resource, data);
  }
};

export default ApiService;
```

### Backend API Endpoint
```javascript
// userController.js
const UserController = {
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await UserService.findById(userId);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }
};

export default UserController;
```

### WebSocket Bağlantısı
```javascript
// Frontend
import io from 'socket.io-client';

const socket = io(WEBSOCKET_URL, {
  auth: {
    token: localStorage.getItem('token')
  }
});

socket.on('connect', () => {
  console.log('Connected to WebSocket');
});

// Backend
io.on('connection', (socket) => {
  const token = socket.handshake.auth.token;
  // Token doğrulama
  socket.join(`user:${userId}`);
});
```

## 9. Deployment Kontrol Listesi

### Environment Variables
- [ ] API URL'leri
- [ ] WebSocket URL'leri
- [ ] API anahtarları
- [ ] Environment-specific config

### CORS Yapılandırması
- [ ] Allowed origins
- [ ] Allowed methods
- [ ] Allowed headers
- [ ] Credentials settings

### Security Headers
- [ ] Content Security Policy
- [ ] X-Frame-Options
- [ ] X-XSS-Protection
- [ ] X-Content-Type-Options

### SSL/TLS
- [ ] HTTPS zorunluluğu
- [ ] SSL sertifikaları
- [ ] Secure cookie settings

## 10. Monitoring ve Logging

### Frontend Monitoring
- [ ] Error tracking
- [ ] Performance monitoring
- [ ] User behavior analytics
- [ ] Console logging

### Backend Monitoring
- [ ] API metrics
- [ ] Server metrics
- [ ] Database metrics
- [ ] WebSocket metrics

### Logging
- [ ] Request/Response logging
- [ ] Error logging
- [ ] Performance logging
- [ ] Security logging

## 11. Pratik Örnekler

### Login İşlemi Örneği
```javascript
// Frontend (Vue.js)
async login(email, password) {
  try {
    const response = await axios.post('/api/auth/login', {
      email,
      password
    });
    
    // Token'ı sakla
    localStorage.setItem('token', response.data.token);
    
    // Store'u güncelle
    this.$store.commit('setUser', response.data.user);
    
    // Yönlendirme yap
    this.$router.push('/dashboard');
  } catch (error) {
    this.handleError(error);
  }
}

// Backend (Node.js)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    
    // Şifreyi kontrol et
    if (!user || !await user.comparePassword(password)) {
      return res.status(401).json({
        error: 'Geçersiz kimlik bilgileri'
      });
    }
    
    // Token oluştur
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
    res.json({
      token,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Sunucu hatası'
    });
  }
});
```

### Gerçek Zamanlı Mesajlaşma Örneği
```javascript
// Frontend (Vue.js)
const socket = io(WEBSOCKET_URL);

// Mesaj gönderme
function sendMessage(message) {
  socket.emit('new-message', {
    text: message,
    userId: currentUser.id
  });
}

// Mesaj alma
socket.on('message-received', (message) => {
  this.$store.commit('addMessage', message);
});

// Backend (Node.js)
io.on('connection', (socket) => {
  socket.on('new-message', async (data) => {
    // Mesajı veritabanına kaydet
    const message = await Message.create(data);
    
    // Tüm bağlı kullanıcılara gönder
    io.emit('message-received', message);
  });
});
```

## 12. Yaygın Hatalar ve Çözümleri

### CORS Hataları
```javascript
// Backend CORS yapılandırması
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
```

### Token Yenileme
```javascript
// Frontend interceptor
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response.status === 401) {
      // Token'ı yenile
      const newToken = await refreshToken();
      // İsteği tekrarla
      return axios.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

### Veri Senkronizasyonu
```javascript
// Frontend WebSocket bağlantısı koptuğunda
socket.on('disconnect', () => {
  // Yeniden bağlan
  socket.connect();
  
  // Eksik verileri al
  fetchMissingData();
});
```

