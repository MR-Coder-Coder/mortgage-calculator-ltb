// functions/index.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

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