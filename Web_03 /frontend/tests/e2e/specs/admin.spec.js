import { test, expect } from '@playwright/test'

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    // Admin olarak login ol
    await page.goto('/admin/login')
    await page.fill('input[name="email"]', process.env.ADMIN_EMAIL)
    await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD)
    await page.click('button[type="submit"]')
    
    // Login sonrası admin paneline yönlendirildiğini kontrol et
    await expect(page).toHaveURL('/admin/dashboard')
  })

  test('dashboard sayfasını görüntüleyebilmeli', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dashboard')
    
    // İstatistik kartlarının varlığını kontrol et
    await expect(page.locator('.stat-card')).toHaveCount(4)
  })

  test('ürün listesini görüntüleyebilmeli', async ({ page }) => {
    await page.click('text=Ürünler')
    await expect(page).toHaveURL('/admin/products')
    
    // Ürün tablosunun varlığını kontrol et
    await expect(page.locator('table')).toBeVisible()
  })

  test('yeni ürün ekleyebilmeli', async ({ page }) => {
    await page.goto('/admin/products/create')
    
    // Form alanlarını doldur
    await page.fill('input[name="name"]', 'Test Ürün')
    await page.fill('input[name="price"]', '99.99')
    await page.fill('textarea[name="description"]', 'Test ürün açıklaması')
    await page.selectOption('select[name="category"]', 'electronics')
    
    // Ürün resmini yükle
    await page.setInputFiles('input[type="file"]', 'test-image.jpg')
    
    // Formu gönder
    await page.click('button[type="submit"]')
    
    // Başarılı mesajını kontrol et
    await expect(page.locator('.success-message')).toBeVisible()
  })

  test('sipariş detaylarını görüntüleyebilmeli', async ({ page }) => {
    await page.goto('/admin/orders')
    
    // İlk siparişe tıkla
    await page.click('.order-row >> nth=0')
    
    // Sipariş detaylarının görüntülendiğini kontrol et
    await expect(page.locator('.order-details')).toBeVisible()
  })

  test('müşteri listesini görüntüleyebilmeli', async ({ page }) => {
    await page.click('text=Müşteriler')
    await expect(page).toHaveURL('/admin/customers')
    
    // Müşteri tablosunun varlığını kontrol et
    await expect(page.locator('table')).toBeVisible()
    
    // Müşteri arama yapabilme
    await page.fill('input[placeholder="Müşteri ara..."]', 'test@example.com')
    await page.press('input[placeholder="Müşteri ara..."]', 'Enter')
    
    // Arama sonuçlarını kontrol et
    await expect(page.locator('.customer-row')).toHaveCount(1)
  })

  test('yetkisiz erişim engellenebilmeli', async ({ page }) => {
    // Logout yap
    await page.click('text=Çıkış')
    
    // Admin sayfalarına erişmeye çalış
    await page.goto('/admin/dashboard')
    
    // Login sayfasına yönlendirildiğini kontrol et
    await expect(page).toHaveURL('/admin/login')
  })
}) 