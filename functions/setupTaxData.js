const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}

// Function to set up tax data in Firestore and return the entries
exports.setupTaxData = functions.https.onCall(async (data, context) => {
    const db = admin.firestore();
  
    const taxData = [
      {
        id: 'personalTax',
        data: {
          incomeTaxRate: 20,
          capitalGainsTaxRate: 18,
          personalTaxRelief: 12500,
        },
      },
      {
        id: 'corporateTax',
        data: {
          corporateTaxRate: 19,
          capitalGainsTaxRate: 19,
          corporateTaxRelief: 0,
        },
      },
      {
        id: 'mortgageData',
        data: {
          interestDeductibleRate: 100,
          personalInterestDeduction: 50,
        },
      },
    ];
  
    try {
      // Write tax data to Firestore
      for (const doc of taxData) {
        await db.collection('taxData').doc(doc.id).set(doc.data);
      }
  
      // Fetch and return the newly written data
      const snapshot = await db.collection('taxData').get();
      const returnedData = [];
      snapshot.forEach((doc) => {
        returnedData.push({
          id: doc.id,
          data: doc.data(),
        });
      });
  
      return { message: 'Tax data setup completed successfully.', taxData: returnedData };
    } catch (error) {
      console.error('Error writing or fetching tax data:', error);
      throw new functions.https.HttpsError('internal', 'Error setting up or fetching tax data.');
    }
  });