import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, Timestamp, serverTimestamp, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
}

// Firebase'i başlat
const app = initializeApp(firebaseConfig)

// Servisleri al
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Development modunda emülatörleri bağla
if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099')
  connectFirestoreEmulator(db, 'localhost', 8080)
  connectStorageEmulator(storage, 'localhost', 9199)
}

// Servisleri dışa aktar
export { auth, db, storage }

// Timestamp ve serverTimestamp'i dışa aktar
export {
  Timestamp,
  serverTimestamp
}

// Varsayılan olarak app'i dışa aktar
export default app 