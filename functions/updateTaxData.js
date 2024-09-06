const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}

// Function to update specific tax data in Firestore
exports.updateTaxData = functions.https.onCall(async (data, context) => {
    const db = admin.firestore();
  
    const { id, updatedData } = data;
  
    if (!id || !updatedData) {
      throw new functions.https.HttpsError('invalid-argument', 'Tax document ID and data are required.');
    }
  
    try {
      await db.collection('taxData').doc(id).set(updatedData, { merge: true });
      return { message: `Tax data for ${id} updated successfully.` };
    } catch (error) {
      console.error('Error updating tax data:', error);
      throw new functions.https.HttpsError('internal', 'Error updating tax data.');
    }
  });