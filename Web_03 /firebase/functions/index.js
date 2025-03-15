const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Kullanıcı oluşturulduğunda tetiklenir
exports.createUserProfile = functions.auth.user().onCreate((user) => {
  return admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    role: 'user'
  });
});

// Sipariş oluşturulduğunda stok güncelleme
exports.updateProductStock = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();
    const batch = admin.firestore().batch();

    for (const item of order.items) {
      const productRef = admin.firestore().collection('products').doc(item.productId);
      batch.update(productRef, {
        stock: admin.firestore.FieldValue.increment(-item.quantity)
      });
    }

    return batch.commit();
  });

// Bildirim gönderme
exports.sendNotification = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Yetkilendirme gerekli');
  }

  const { userId, message, title } = data;
  
  await admin.firestore().collection('notifications').add({
    userId,
    message,
    title,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    read: false
  });

  return { success: true };
}); 