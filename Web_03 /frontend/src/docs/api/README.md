# API Dokümantasyonu

Bu dokümantasyon, projenin API yapısını ve kullanımını detaylı olarak açıklar.

## İçindekiler

1. [Kimlik Doğrulama](./authentication.md)
2. [Endpoints](./endpoints.md)
3. [Modeller](./models.md)

## Genel Bakış

API, RESTful prensiplerini takip eder ve JSON formatında veri alışverişi yapar.

### Temel URL

```
Production: https://api.example.com/v1
Development: http://localhost:3000/v1
```

### İstek Başlıkları

Tüm isteklerde aşağıdaki başlıklar kullanılmalıdır:

```
Content-Type: application/json
Authorization: Bearer <token>
```

### Hata Kodları

| Kod | Açıklama |
|-----|-----------|
| 200 | Başarılı |
| 201 | Oluşturuldu |
| 400 | Geçersiz İstek |
| 401 | Yetkisiz |
| 403 | Yasaklı |
| 404 | Bulunamadı |
| 500 | Sunucu Hatası |

### Rate Limiting

- Her IP için dakikada 100 istek
- Auth gerektiren endpointler için kullanıcı başına dakikada 60 istek

### Güvenlik

- Tüm istekler HTTPS üzerinden yapılmalıdır
- API anahtarları `.env` dosyasında saklanmalıdır
- Hassas veriler şifrelenerek iletilmelidir

### Versiyon Kontrolü

API versiyonları URL'de belirtilir: `/v1`, `/v2` gibi.

## Daha Fazla Bilgi

Detaylı bilgi için:
- [Kimlik Doğrulama](./authentication.md)
- [Endpoints](./endpoints.md)
- [Modeller](./models.md) 