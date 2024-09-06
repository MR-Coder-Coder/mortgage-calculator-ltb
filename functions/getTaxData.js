const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}

// Function to get existing tax data from Firestore
exports.getTaxData = functions.https.onCall(async (data, context) => {
    const db = admin.firestore();
  
    try {
      const snapshot = await db.collection('taxData').get();
      const returnedData = [];
      snapshot.forEach((doc) => {
        returnedData.push({
          id: doc.id,
          data: doc.data(),
        });
      });
  
      return { taxData: returnedData };
    } catch (error) {
      console.error('Error fetching tax data:', error);
      throw new functions.https.HttpsError('internal', 'Error fetching tax data.');
    }
  });