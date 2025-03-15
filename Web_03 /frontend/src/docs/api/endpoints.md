# API Endpoints

Bu bölüm, API'nin tüm endpoint'lerini ve kullanımlarını detaylı olarak açıklar.

## Kullanıcı Endpoints

### Kullanıcı İşlemleri

#### GET /users

Tüm kullanıcıları listeler.

**Query Parametreleri:**
- `page`: Sayfa numarası (varsayılan: 1)
- `limit`: Sayfa başına kayıt (varsayılan: 10)
- `sort`: Sıralama kriteri (örn: name_asc, created_at_desc)
- `search`: Arama terimi

**Başarılı Yanıt (200 OK):**
```json
{
  "data": [
    {
      "id": "123",
      "name": "Ahmet Yılmaz",
      "email": "ahmet@ornek.com",
      "role": "user",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 48,
    "itemsPerPage": 10
  }
}
```

#### GET /users/{id}

Belirli bir kullanıcının detaylarını getirir.

#### POST /users

Yeni kullanıcı oluşturur.

**İstek Gövdesi:**
```json
{
  "name": "Yeni Kullanıcı",
  "email": "yeni@ornek.com",
  "password": "Sifre123!",
  "role": "user"
}
```

## Ürün Endpoints

### Ürün İşlemleri

#### GET /products

Tüm ürünleri listeler.

**Query Parametreleri:**
- `category`: Kategori ID
- `brand`: Marka ID
- `minPrice`: Minimum fiyat
- `maxPrice`: Maksimum fiyat
- `inStock`: Stokta var/yok (boolean)

#### POST /products

Yeni ürün ekler.

**İstek Gövdesi:**
```json
{
  "name": "Yeni Ürün",
  "description": "Ürün açıklaması",
  "price": 199.99,
  "categoryId": "456",
  "stock": 100,
  "images": ["url1", "url2"]
}
```

## Sipariş Endpoints

### Sipariş İşlemleri

#### GET /orders

Siparişleri listeler.

#### POST /orders

Yeni sipariş oluşturur.

## Ödeme Endpoints

### Ödeme İşlemleri

#### POST /payments

Ödeme işlemi başlatır.

## Hata Yanıtları

Tüm endpoint'ler için standart hata yanıtı formatı:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Geçersiz istek",
    "details": {
      "field": "email",
      "reason": "Geçersiz e-posta formatı"
    }
  }
}
```

## Rate Limiting

Her endpoint için ayrı rate limit uygulanır:
- GET istekleri: 100 istek/dakika
- POST/PUT/DELETE istekleri: 60 istek/dakika

## Versiyon Geçmişi

| Versiyon | Tarih | Değişiklikler |
|----------|-------|---------------|
| v1.0.0 | 2024-01-01 | İlk sürüm |
| v1.1.0 | 2024-02-01 | Yeni endpoint'ler eklendi | 