# Bileşen Dokümantasyonu

Bu bölüm, projedeki Vue.js bileşenlerinin kullanımını ve özelliklerini detaylı olarak açıklar.

## İçindekiler

1. [Kullanım Kılavuzu](./usage.md)
2. [Props Referansı](./props.md)
3. [Events Referansı](./events.md)

## Bileşen Kategorileri

### Form Bileşenleri
- FormGenerator
- FormPreview
- ValidationRules
- FieldTypes

### Tablo Bileşenleri
- DataTable
- TableFilter
- TablePagination
- TableExport

### Grafik Bileşenleri
- LineChart
- BarChart
- PieChart
- AreaChart
- RadarChart

### Yönetim Paneli Bileşenleri
- Dashboard
- UserManagement
- ProductManagement
- OrderManagement
- CategoryManagement

### Ödeme Bileşenleri
- PaymentForm
- PaymentMethods
- PaymentHistory
- InvoiceDetails

### Filtre Bileşenleri
- PriceFilter
- CategoryFilter
- BrandFilter
- AttributeFilter

## Bileşen Yapısı

Her bileşen aşağıdaki standart yapıyı takip eder:

```vue
<template>
  <!-- Bileşen şablonu -->
</template>

<script>
export default {
  name: 'ComponentName',
  props: {
    // Bileşen props'ları
  },
  emits: [
    // Bileşen events'leri
  ],
  setup(props, { emit }) {
    // Composition API kullanımı
  }
}
</script>

<style scoped>
  /* Bileşene özel stiller */
</style>
```

## Stil Kılavuzu

1. **Naming Conventions**
   - Bileşen isimleri PascalCase
   - Props isimleri camelCase
   - Event isimleri kebab-case

2. **Props Validasyonu**
   - Tüm props'lar için tip kontrolü
   - Gerekli props'lar için required: true
   - Varsayılan değerler için default tanımı

3. **Event Handling**
   - Event isimleri açıklayıcı olmalı
   - Emit edilen veriler dokümante edilmeli

4. **Composition API**
   - ref ve reactive kullanımı
   - computed properties
   - lifecycle hooks

## Best Practices

1. **Performans**
   - v-show vs v-if kullanımı
   - computed vs methods tercihi
   - gereksiz re-render'ları önleme

2. **Erişilebilirlik**
   - ARIA attributes kullanımı
   - Klavye navigasyonu desteği
   - Renk kontrastı kontrolü

3. **Responsive Tasarım**
   - Tailwind breakpoints kullanımı
   - Mobile-first yaklaşım
   - Esnek grid sistemleri

4. **Error Handling**
   - Props validasyonu
   - Try-catch blokları
   - Hata durumu gösterimi

## Örnek Kullanım

```vue
<template>
  <DataTable 
    :data="items"
    :columns="columns"
    @row-click="handleRowClick"
  />
</template>

<script>
import { ref } from 'vue'
import DataTable from '@/components/table/DataTable.vue'

export default {
  components: {
    DataTable
  },
  setup() {
    const items = ref([])
    const columns = ref([])

    const handleRowClick = (row) => {
      console.log('Seçilen satır:', row)
    }

    return {
      items,
      columns,
      handleRowClick
    }
  }
}
</script> 