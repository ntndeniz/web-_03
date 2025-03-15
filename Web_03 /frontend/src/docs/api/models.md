# Veri Modelleri

Bu bölüm, API'de kullanılan veri modellerini ve şemalarını detaylı olarak açıklar.

## Kullanıcı Modeli

### User

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'vendor';
  status: 'active' | 'inactive' | 'banned';
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
  settings?: UserSettings;
}

interface UserProfile {
  avatar?: string;
  phone?: string;
  address?: Address[];
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
}

interface UserSettings {
  notifications: boolean;
  newsletter: boolean;
  language: string;
  theme: 'light' | 'dark';
}
```

## Ürün Modeli

### Product

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  categoryId: string;
  brandId: string;
  stock: number;
  images: string[];
  status: 'active' | 'inactive' | 'draft';
  attributes: ProductAttribute[];
  variants: ProductVariant[];
  ratings: Rating[];
  createdAt: string;
  updatedAt: string;
}

interface ProductAttribute {
  name: string;
  value: string;
}

interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: {
    [key: string]: string;
  };
}
```

## Sipariş Modeli

### Order

```typescript
interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  total: number;
}

type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';
```

## Adres Modeli

### Address

```typescript
interface Address {
  id: string;
  type: 'shipping' | 'billing';
  name: string;
  phone: string;
  country: string;
  city: string;
  district: string;
  street: string;
  postalCode: string;
  isDefault: boolean;
}
```

## Değerlendirme Modeli

### Rating

```typescript
interface Rating {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  rating: number;
  comment?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}
```

## İlişkiler

### Kullanıcı İlişkileri
- Bir kullanıcının birden fazla adresi olabilir
- Bir kullanıcının birden fazla siparişi olabilir
- Bir kullanıcının birden fazla değerlendirmesi olabilir

### Ürün İlişkileri
- Bir ürünün bir kategorisi olabilir
- Bir ürünün bir markası olabilir
- Bir ürünün birden fazla varyantı olabilir
- Bir ürünün birden fazla değerlendirmesi olabilir

### Sipariş İlişkileri
- Bir siparişin bir kullanıcısı olur
- Bir siparişin birden fazla ürünü olabilir
- Bir siparişin bir teslimat adresi olur
- Bir siparişin bir fatura adresi olur 