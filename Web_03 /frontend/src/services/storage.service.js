import { storage } from '@/firebase'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

const StorageService = {
  /**
   * Dosya yükleme
   * @param {File} file - Yüklenecek dosya
   * @param {string} path - Yükleme yolu
   * @returns {Promise<string>} - Dosya URL'i
   */
  async uploadFile(file, path) {
    try {
      const storageRef = ref(storage, path)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      return downloadURL
    } catch (error) {
      console.error('Dosya yükleme hatası:', error)
      throw new Error('Dosya yüklenirken bir hata oluştu')
    }
  },

  /**
   * Resim yükleme
   * @param {File} image - Yüklenecek resim
   * @param {string} folder - Klasör adı
   * @returns {Promise<string>} - Resim URL'i
   */
  async uploadImage(image, folder = 'images') {
    const extension = image.name.split('.').pop()
    const fileName = `${Date.now()}.${extension}`
    const path = `${folder}/${fileName}`
    return this.uploadFile(image, path)
  },

  /**
   * Profil resmi yükleme
   * @param {File} image - Profil resmi
   * @param {string} userId - Kullanıcı ID'si
   * @returns {Promise<string>} - Resim URL'i
   */
  async uploadProfileImage(image, userId) {
    const path = `users/${userId}/profile.${image.name.split('.').pop()}`
    return this.uploadFile(image, path)
  },

  /**
   * Ürün resmi yükleme
   * @param {File} image - Ürün resmi
   * @param {string} productId - Ürün ID'si
   * @returns {Promise<string>} - Resim URL'i
   */
  async uploadProductImage(image, productId) {
    const path = `products/${productId}/${Date.now()}.${image.name.split('.').pop()}`
    return this.uploadFile(image, path)
  },

  /**
   * Dosya silme
   * @param {string} path - Silinecek dosya yolu
   * @returns {Promise<void>}
   */
  async deleteFile(path) {
    try {
      const storageRef = ref(storage, path)
      await deleteObject(storageRef)
    } catch (error) {
      console.error('Dosya silme hatası:', error)
      throw new Error('Dosya silinirken bir hata oluştu')
    }
  },

  /**
   * URL'den dosya yolunu alma
   * @param {string} url - Dosya URL'i
   * @returns {string} - Dosya yolu
   */
  getPathFromURL(url) {
    const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/'
    return url.replace(baseUrl, '')
  }
}

export default StorageService 