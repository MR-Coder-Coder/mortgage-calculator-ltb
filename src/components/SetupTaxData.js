// src/components/SetupTaxData.js

import React, { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../firebase'; // Ensure your Firebase app is correctly initialized
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const SetupTaxData = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [taxData, setTaxData] = useState([]); // Initialize taxData as an empty array
  const [loading, setLoading] = useState(false); // Loading state to manage button state
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSetupTaxData = async () => {
    const functions = getFunctions(app);
    const setupTaxData = httpsCallable(functions, 'setupTaxData');

    setLoading(true); // Set loading state to true when starting

    try {
      const response = await setupTaxData(); // Call the cloud function
      setMessage(response.data.message); // Set success message from response
      setTaxData(response.data.taxData || []); // Set the returned tax data or fallback to empty array
      setError(''); // Clear any previous error messages
    } catch (error) {
      console.error('Error calling setupTaxData function:', error);
      setMessage(''); // Clear any previous success messages
      setError(error.message || 'Failed to set up tax data. Please try again.'); // Display the error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="setup-tax-data">
      <h2>Setup Tax Data</h2>
      <button onClick={handleSetupTaxData} disabled={loading}>
        {loading ? 'Initializing...' : 'Initialize Tax Data'}
      </button>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display the tax data entries */}
      {taxData.length > 0 && (
        <div className="tax-data-list">
          <h3>Tax Data Entries</h3>
          <ul>
            {taxData.map((entry) => (
              <li key={entry.id}>
                <strong>{entry.id}</strong>: {JSON.stringify(entry.data)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="nav-button" onClick={() => navigate('/calculator')}>Go to Mortgage Calculator</button>
    </div>
  );
};

export default SetupTaxData;
