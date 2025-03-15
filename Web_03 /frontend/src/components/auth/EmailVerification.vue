<script>
// ... önceki kod devam ediyor ...

    const resendVerification = async () => {
      if (loading.value || countdown.value > 0) return

      loading.value = true
      error.value = ''

      try {
        await store.dispatch('auth/sendEmailVerification')
        startCountdown()
      } catch (err) {
        error.value = 'Doğrulama e-postası gönderilirken bir hata oluştu'
      } finally {
        loading.value = false
      }
    }

    const goToDashboard = () => {
      router.push('/hesabim')
    }

    const logout = async () => {
      try {
        await store.dispatch('auth/logout')
        router.push('/giris')
      } catch (err) {
        console.error('Çıkış yapılırken hata:', err)
      }
    }

    onMounted(async () => {
      const user = store.state.auth.user
      if (!user) {
        router.push('/giris')
        return
      }

      email.value = user.email
      verified.value = user.emailVerified

      if (!verified.value) {
        checkInterval = setInterval(checkVerification, 5000)
      }
    })

    onUnmounted(() => {
      if (checkInterval) clearInterval(checkInterval)
      if (countdownInterval) clearInterval(countdownInterval)
    })

    return {
      loading,
      error,
      verified,
      countdown,
      email,
      resendVerification,
      goToDashboard,
      logout
    }
  }
}
</script> 