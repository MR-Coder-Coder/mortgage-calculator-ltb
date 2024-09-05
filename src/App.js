import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import MortgageCalculator from './components/MortgageCalculator';
import SetupTaxData from './components/SetupTaxData'; // Import the new component
import './App.css';

function App() {
  console.log("App rendering"); // Debug log
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/calculator" element={<MortgageCalculator />} />
          <Route path="/setup-tax-data" element={<SetupTaxData />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
