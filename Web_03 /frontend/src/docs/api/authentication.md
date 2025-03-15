# Kimlik Doğrulama

Bu bölüm, API'nin kimlik doğrulama ve yetkilendirme mekanizmalarını açıklar.

## Giriş Yapma

### POST /auth/login

Kullanıcı girişi için kullanılır.

#### İstek

```json
{
  "email": "kullanici@ornek.com",
  "password": "sifre123",
  "rememberMe": true
}
```

#### Başarılı Yanıt (200 OK)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "kullanici@ornek.com",
    "name": "Ahmet Yılmaz",
    "role": "user"
  }
}
```

### Token Yenileme

#### POST /auth/refresh

Access token'ı yenilemek için kullanılır.

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Çıkış Yapma

#### POST /auth/logout

Oturumu sonlandırmak için kullanılır.

## Şifre İşlemleri

### POST /auth/forgot-password

Şifre sıfırlama e-postası göndermek için kullanılır.

```json
{
  "email": "kullanici@ornek.com"
}
```

### POST /auth/reset-password

Şifre sıfırlama işlemi için kullanılır.

```json
{
  "token": "sifirlama-token",
  "password": "yeni-sifre",
  "passwordConfirmation": "yeni-sifre"
}
```

## Güvenlik Önlemleri

1. **Token Güvenliği**
   - Access token'lar 1 saat geçerlidir
   - Refresh token'lar 30 gün geçerlidir
   - Token'lar JWT formatındadır

2. **Oturum Güvenliği**
   - Maksimum 5 başarısız giriş denemesi
   - IP bazlı rate limiting
   - Şüpheli aktivitelerde e-posta bildirimi

3. **Şifre Politikası**
   - Minimum 8 karakter
   - En az 1 büyük harf
   - En az 1 küçük harf
   - En az 1 rakam
   - En az 1 özel karakter

## Hata Kodları

| Kod | Açıklama |
|-----|-----------|
| 401 | Geçersiz kimlik bilgileri |
| 403 | Yetkisiz erişim |
| 429 | Çok fazla deneme |

## Örnek Kullanım

```javascript
const login = async (email, password) => {
  try {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Giriş başarısız');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Giriş hatası:', error);
    throw error;
  }
};
``` 