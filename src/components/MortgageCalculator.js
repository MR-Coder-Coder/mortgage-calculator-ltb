import React, { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../firebase'; // Make sure this is your Firebase app initialization file
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const MortgageCalculator = () => {
  const [personalIncome, setPersonalIncome] = useState('');
  const [companyIncome, setCompanyIncome] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [results, setResults] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate function

  const handleCalculate = async () => {
    const functions = getFunctions(app);
    const calculateMortgage = httpsCallable(functions, 'calculateMortgage');

    try {
      const response = await calculateMortgage({
        personalIncome: Number(personalIncome),
        companyIncome: Number(companyIncome),
        loanAmount: Number(loanAmount),
        interestRate: Number(interestRate),
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error calling cloud function:', error);
      setResults({ message: 'Error calculating mortgage. Please try again later.' });
    }
  };

  return (
    <div className="mortgage-calculator">
      <h2>Mortgage Tax Calculator</h2>
      <input
        type="number"
        placeholder="Personal Income"
        value={personalIncome}
        onChange={(e) => setPersonalIncome(e.target.value)}
      />
      <input
        type="number"
        placeholder="Company Income"
        value={companyIncome}
        onChange={(e) => setCompanyIncome(e.target.value)}
      />
      <input
        type="number"
        placeholder="Loan Amount"
        value={loanAmount}
        onChange={(e) => setLoanAmount(e.target.value)}
      />
      <input
        type="number"
        placeholder="Interest Rate (%)"
        value={interestRate}
        onChange={(e) => setInterestRate(e.target.value)}
      />
      <button onClick={handleCalculate}>Calculate</button>
      
      {results && (
        <div>
          <h3>Results:</h3>
          <p>{results.message}</p>
          <div className="results-grid">
            <div className="grid-header">Personal Tax</div>
            <div className="grid-header">Company Tax</div>
            <div>{results.personalTax}</div>
            <div>{results.companyTax}</div>
          </div>
          <div className="results-grid">
          <div className="grid-header">PPR Value</div>
          <div>{results.pprValue}</div> {/* Display the PPR value */}
          </div>
        </div>
      )}
      
      <button className="nav-button" onClick={() => navigate('/setup-tax-data')}>Go to Setup Tax Data</button>
    </div>
  );
};

export default MortgageCalculator;
