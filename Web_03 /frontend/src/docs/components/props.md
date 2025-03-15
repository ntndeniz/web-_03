# Props Referansı

Bu bölüm, projedeki bileşenlerin props'larını detaylı olarak açıklar.

## Form Builder Props

### FormGenerator

| Prop | Tip | Zorunlu | Varsayılan | Açıklama |
|------|-----|----------|------------|-----------|
| fields | Array | Evet | - | Form alanlarının tanımları |
| title | String | Hayır | '' | Form başlığı |
| description | String | Hayır | '' | Form açıklaması |
| submitText | String | Hayır | 'Gönder' | Gönder butonu metni |
| loading | Boolean | Hayır | false | Yükleniyor durumu |

#### Field Nesnesi Yapısı
```typescript
interface Field {
  id: string;
  type: 'text' | 'number' | 'email' | 'select' | 'checkbox' | 'radio' | 'textarea';
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ value: string | number, label: string }>;
  validation?: ValidationRule[];
}
```

### ValidationRules

| Prop | Tip | Zorunlu | Varsayılan | Açıklama |
|------|-----|----------|------------|-----------|
| modelValue | Array | Evet | [] | Doğrulama kuralları listesi |
| field | Object | Evet | - | Kural eklenecek alan bilgisi |

## Tablo Props

### DataTable

| Prop | Tip | Zorunlu | Varsayılan | Açıklama |
|------|-----|----------|------------|-----------|
| data | Array | Evet | - | Tablo verileri |
| columns | Array | Evet | - | Tablo sütunları |
| pagination | Boolean | Hayır | true | Sayfalama özelliği |
| searchable | Boolean | Hayır | true | Arama özelliği |
| sortable | Boolean | Hayır | true | Sıralama özelliği |
| perPage | Number | Hayır | 10 | Sayfa başına kayıt |

#### Column Nesnesi Yapısı
```typescript
interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  formatter?: (value: any) => string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}
```

## Grafik Props

### LineChart

| Prop | Tip | Zorunlu | Varsayılan | Açıklama |
|------|-----|----------|------------|-----------|
| data | Object | Evet | - | Grafik verileri |
| options | Object | Hayır | {} | Grafik seçenekleri |
| height | Number | Hayır | 400 | Grafik yüksekliği |
| width | String | Hayır | '100%' | Grafik genişliği |

#### Data Nesnesi Yapısı
```typescript
interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }>;
}
```

## Ortak Props

### LoadingSpinner

| Prop | Tip | Zorunlu | Varsayılan | Açıklama |
|------|-----|----------|------------|-----------|
| size | String | Hayır | 'md' | Spinner boyutu (sm/md/lg) |
| color | String | Hayır | 'primary' | Spinner rengi |

### ErrorMessage

| Prop | Tip | Zorunlu | Varsayılan | Açıklama |
|------|-----|----------|------------|-----------|
| message | String | Evet | - | Hata mesajı |
| type | String | Hayır | 'error' | Mesaj tipi (error/warning) |

## Props Kullanım Örnekleri

### Form Generator Kullanımı
```vue
<FormGenerator
  :fields="[
    {
      id: 'name',
      type: 'text',
      label: 'Ad Soyad',
      required: true,
      validation: [
        { type: 'required', message: 'Ad Soyad zorunludur' },
        { type: 'minLength', value: 3, message: 'En az 3 karakter' }
      ]
    }
  ]"
  title="Kullanıcı Formu"
  description="Kullanıcı bilgilerini giriniz"
  @submit="handleSubmit"
/>
```

### DataTable Kullanımı
```vue
<DataTable
  :data="users"
  :columns="[
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Ad', sortable: true },
    { key: 'email', label: 'E-posta', searchable: true }
  ]"
  :pagination="true"
  :searchable="true"
  :per-page="20"
/>
``` 