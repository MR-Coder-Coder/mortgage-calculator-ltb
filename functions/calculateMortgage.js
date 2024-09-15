const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}

exports.calculateMortgage = functions.https.onCall(async (data, context) => {
  const { personalIncome, companyIncome, loanAmount, interestRate } = data;

  // Fetch percentages and reliefs from Firestore
  const db = admin.firestore();
  try {
    const taxSnapshot = await db.collection('taxData').get();
    const taxData = {};
    taxSnapshot.forEach(doc => taxData[doc.id] = doc.data());

    // Extract specific data from Firestore document
    const corporateTaxData = taxData.corporateTax;
    const personalTaxData = taxData.personalTax;
    const mortgageData = taxData.mortgageData;
    const pprData = taxData.pprData; // New PPR data


    // Calculate personal and corporate tax based on data
    const personalTax = calculatePersonalTax(
      personalIncome,
      loanAmount,
      interestRate,
      personalTaxData,
      mortgageData
    );
    const companyTax = calculateCompanyTax(
      companyIncome,
      loanAmount,
      interestRate,
      corporateTaxData,
      mortgageData
    );

    // PPR Logic
    const pprValue = calculatePPR(pprData);

    // Determine which option is better
    const betterOption = personalTax < companyTax ? 'personal' : 'company';

    return {
      message: `It's better to take the mortgage in your ${betterOption} name.`,
      personalTax,
      companyTax,
      pprValue,
    };
  } catch (error) {
    console.error('Error fetching tax data:', error);
    throw new functions.https.HttpsError('internal', 'Error fetching tax data.');
  }
});

function calculatePersonalTax(personalIncome, loanAmount, interestRate, personalTaxData, mortgageData) {
  // Tax-related constants fetched from Firestore
  const personalTaxRelief = personalTaxData.personalTaxRelief;
  const capitalGainsTaxRate = personalTaxData.capitalGainsTaxRate;
  const incomeTaxRate = personalTaxData.incomeTaxRate;

  // Example calculation logic (simplified for clarity)
  const taxableIncome = personalIncome - personalTaxRelief;
  const interest = loanAmount * (interestRate / 100);
  const capitalGainsTax = taxableIncome * (capitalGainsTaxRate / 100);
  const incomeTax = taxableIncome * (incomeTaxRate / 100);

  return incomeTax + capitalGainsTax + interest; // Simplified example
}

function calculateCompanyTax(companyIncome, loanAmount, interestRate, corporateTaxData, mortgageData) {
  // Tax-related constants fetched from Firestore
  const corporateTaxRate = corporateTaxData.corporateTaxRate;
  const corporateTaxRelief = corporateTaxData.corporateTaxRelief;

  // Example calculation logic (simplified for clarity)
  const taxableCompanyIncome = companyIncome - corporateTaxRelief;
  const interest = loanAmount * (interestRate / 100);
  const companyTax = taxableCompanyIncome * (corporateTaxRate / 100);

  return companyTax + interest; // Simplified example
}

// PPR Calculation Logic
function calculatePPR(pprData) {
  const { propertyValue, growthInValue, yearsUnderPPR, ownershipDurationMonths } = pprData;

  const taxableGain = propertyValue - growthInValue;
  const pprFraction = yearsUnderPPR / ownershipDurationMonths;

  const pprValue = pprFraction * taxableGain;

  return pprValue;
}