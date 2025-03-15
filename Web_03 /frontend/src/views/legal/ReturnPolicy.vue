<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">İade Politikası</h1>
      
      <div class="prose prose-lg">
        <section>
          <h2>1. İade Süresi</h2>
          <p>
            Ürünlerimizi teslim aldıktan sonra 14 gün içinde iade edebilirsiniz. 
            Bu süre içinde ürünü herhangi bir sebep belirtmeden iade etme hakkına sahipsiniz.
          </p>
        </section>

        <section>
          <h2>2. İade Koşulları</h2>
          <p>
            İade edilecek ürünler için aşağıdaki koşulların sağlanması gerekmektedir:
          </p>
          <ul>
            <li>Ürün kullanılmamış ve hasarsız olmalıdır</li>
            <li>Orijinal ambalajında olmalıdır</li>
            <li>Tüm etiketleri yerinde olmalıdır</li>
            <li>Fatura veya teslimat belgesi ile birlikte gönderilmelidir</li>
          </ul>
        </section>

        <section>
          <h2>3. İade Süreci</h2>
          <ol>
            <li>Hesabınızdan iade talebinde bulunun</li>
            <li>İade kargo kodunuzu alın</li>
            <li>Ürünü iade koşullarına uygun şekilde paketleyin</li>
            <li>Anlaşmalı kargo firması ile gönderimin yapın</li>
          </ol>
          
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 class="font-semibold mb-2">İade Talebi Oluştur</h3>
            <router-link 
              to="/account/orders"
              class="text-blue-500 hover:text-blue-600"
            >
              Siparişlerim sayfasından iade talebinde bulunabilirsiniz →
            </router-link>
          </div>
        </section>

        <section>
          <h2>4. Geri Ödeme</h2>
          <p>
            İade edilen ürün depomıza ulaştıktan ve kontrolleri yapıldıktan sonra:
          </p>
          <ul>
            <li>Kredi kartı ödemelerinde 3-5 iş günü içinde iade yapılır</li>
            <li>Havale/EFT ödemelerinde 1-2 iş günü içinde iade yapılır</li>
            <li>Kapıda ödeme siparişlerinde banka hesabınıza iade yapılır</li>
          </ul>
        </section>

        <section>
          <h2>5. İade Edilemeyen Ürünler</h2>
          <p>
            Aşağıdaki durumlarda ürün iadesi kabul edilmemektedir:
          </p>
          <ul>
            <li>Kullanılmış veya hasar görmüş ürünler</li>
            <li>Hijyen ürünleri (açılmış paketler)</li>
            <li>Kişiye özel hazırlanan ürünler</li>
            <li>İndirimli satılan ürünler (kusur bildirimi hariç)</li>
          </ul>
        </section>

        <section>
          <h2>6. İletişim</h2>
          <p>
            İade süreciyle ilgili sorularınız için müşteri hizmetlerimize ulaşabilirsiniz:
          </p>
          <ul>
            <li>Telefon: 0800 123 45 67</li>
            <li>E-posta: iade@example.com</li>
            <li>Canlı Destek: 09:00 - 18:00 saatleri arasında</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReturnPolicy',
  metaInfo: {
    title: 'İade Politikası'
  }
}
</script> 