import React, { useEffect, useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../firebase'; // Ensure your Firebase app is correctly initialized
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const SetupTaxData = () => {
  const [taxData, setTaxData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  const functions = getFunctions(app);

  // Function to set up tax data in Firestore
  const setupInitialTaxData = async () => {
    const setupTaxData = httpsCallable(functions, 'setupTaxData');
    setLoading(true);
    try {
      const response = await setupTaxData();
      setMessage(response.data.message);
    } catch (error) {
      setError('Failed to set up tax data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch current tax data from Firestore
  const fetchTaxData = async () => {
    const getTaxData = httpsCallable(functions, 'getTaxData');
    setLoading(true);
    try {
      const response = await getTaxData();
      setTaxData(response.data.taxData || []);
    } catch (error) {
      setError('Failed to fetch tax data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tax data and set up initial tax data if needed
  useEffect(() => {
    const initializeData = async () => {
      await setupInitialTaxData(); // Setup the initial data
      await fetchTaxData(); // Fetch the data after setup
    };

    initializeData();
  }, []);

  // Update the tax data in Firestore
  const handleUpdateTaxData = async (id) => {
    const updateTaxData = httpsCallable(functions, 'updateTaxData');
    setLoading(true);
    try {
      await updateTaxData({ id, updatedData: editData[id] });
      setMessage(`Tax data for ${id} updated successfully.`);
      setEditData({}); // Clear input fields after update
      fetchTaxData(); // Refresh data after update
    } catch (error) {
      setError(`Failed to update tax data for ${id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (id, field, value) => {
    setEditData((prevData) => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        [field]: value,
      },
    }));
  };

  return (
    <div className="setup-tax-data">
      <h2>Setup Tax Data</h2>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {loading && <p>Loading...</p>}

      {/* Display and Edit Tax Data */}
      {taxData.length > 0 && (
        <div className="tax-data-list">
          <h3>Tax Data Entries</h3>
          {taxData.map((entry) => (
            <div key={entry.id} className="tax-entry">
              <h4>{entry.id}</h4>
              {Object.keys(entry.data).map((field) => (
                <div key={field}>
                  <label>
                    {field}:{' '}
                    <input
                      type="number"
                      value={editData[entry.id]?.[field] || entry.data[field]}
                      onChange={(e) =>
                        handleInputChange(entry.id, field, e.target.value)
                      }
                    />
                  </label>
                </div>
              ))}
              <button
                onClick={() => handleUpdateTaxData(entry.id)}
                disabled={loading}
              >
                {loading ? 'Updating...' : `Update ${entry.id}`}
              </button>
            </div>
          ))}
        </div>
      )}

      <button className="nav-button" onClick={() => navigate('/calculator')}>
        Go to Mortgage Calculator
      </button>
    </div>
  );
};

export default SetupTaxData;
