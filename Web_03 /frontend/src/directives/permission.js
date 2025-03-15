import store from '@/store'

export default {
  beforeMount(el, binding) {
    const { value, modifiers } = binding

    // Kullanıcı yetkilerini kontrol et
    function checkPermission() {
      const userPermissions = store.getters['auth/permissions'] || []
      const requiredPermissions = Array.isArray(value) ? value : [value]

      // Tüm izinlerin gerekli olduğu durum
      if (modifiers.all) {
        const hasAllPermissions = requiredPermissions.every(permission => 
          userPermissions.includes(permission)
        )
        if (!hasAllPermissions) {
          hideElement()
        }
      }
      // En az bir iznin yeterli olduğu durum
      else {
        const hasAnyPermission = requiredPermissions.some(permission => 
          userPermissions.includes(permission)
        )
        if (!hasAnyPermission) {
          hideElement()
        }
      }
    }

    // Elementi gizle veya kaldır
    function hideElement() {
      if (modifiers.remove) {
        el.remove()
      } else {
        el.style.display = 'none'
      }
    }

    // İzinleri kontrol et
    checkPermission()

    // Store'daki izinler değiştiğinde tekrar kontrol et
    el._unwatchPermissions = store.watch(
      () => store.getters['auth/permissions'],
      () => checkPermission()
    )
  },
  unmounted(el) {
    // Watch'ı temizle
    if (el._unwatchPermissions) {
      el._unwatchPermissions()
    }
  }
}

// Kullanım örnekleri:
// <button v-permission="'delete_user'">Kullanıcıyı Sil</button>
// <div v-permission.all="['manage_users', 'delete_users']">Yönetici Paneli</div>
// <span v-permission.remove="'view_reports'">Raporlar</span> 