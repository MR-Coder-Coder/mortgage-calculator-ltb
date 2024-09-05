// src/components/SetupTaxData.js

import React, { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../firebase'; // Ensure your Firebase app is correctly initialized
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const SetupTaxData = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSetupTaxData = async () => {
    const functions = getFunctions(app);
    const setupTaxData = httpsCallable(functions, 'setupTaxData');

    try {
      const response = await setupTaxData();
      setMessage(response.data.message);
      setError('');
    } catch (error) {
      console.error('Error calling setupTaxData function:', error);
      setMessage('');
      setError('Failed to set up tax data. Please try again.');
    }
  };

  return (
    <div className="setup-tax-data">
      <h2>Setup Tax Data</h2>
      <button onClick={handleSetupTaxData}>Initialize Tax Data</button>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <button className="nav-button" onClick={() => navigate('/calculator')}>Go to Mortgage Calculator</button>
    </div>
  );
};

export default SetupTaxData;
