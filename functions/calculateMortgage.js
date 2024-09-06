// functions/index.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}

exports.calculateMortgage = functions.https.onCall((data, context) => {
  const { personalIncome, companyIncome, loanAmount, interestRate } = data;

  // Fetch percentages and reliefs from Firestore (or your preferred DB)
  const db = admin.firestore();
  return db.collection('taxData')
    .get()
    .then((snapshot) => {
      const taxData = {};
      snapshot.forEach((doc) => (taxData[doc.id] = doc.data()));

      // Your calculation logic here
      const personalTax = calculatePersonalTax(personalIncome, loanAmount, interestRate, taxData);
      const companyTax = calculateCompanyTax(companyIncome, loanAmount, interestRate, taxData);

      const betterOption = personalTax < companyTax ? 'personal' : 'company';

      return {
        message: `It's better to take the mortgage in your ${betterOption} name.`,
        personalTax,
        companyTax,
      };
    })
    .catch((error) => {
      console.error('Error fetching tax data:', error);
      throw new functions.https.HttpsError('internal', 'Error fetching tax data.');
    });
});

function calculatePersonalTax(personalIncome, loanAmount, interestRate, taxData) {
  // Implement personal tax calculation using taxData
  return personalIncome * loanAmount * interestRate; // Simplified for illustration
}

function calculateCompanyTax(companyIncome, loanAmount, interestRate, taxData) {
  // Implement company tax calculation using taxData
  return companyIncome * loanAmount * interestRate; // Simplified for illustration
}