import React, { useState } from 'react';
import axios from 'axios';

const styles = {
  cart: {
    background: 'linear-gradient(to right, #4CAF50, #2E7D32)',
    color: 'white',
    padding: '40px 20px',
    borderRadius: '10px',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '40px auto',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: '2rem',
    marginBottom: '30px',
  },
  buttonContainer: {
    margin: '20px 0',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '10px',
  },
  button: (enabled) => ({
    backgroundColor: enabled ? '#2E7D32' : '#A5D6A7',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: enabled ? 'pointer' : 'not-allowed',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
    minWidth: '150px',
  }),
  bill: {
    marginTop: '30px',
    background: 'rgba(255, 255, 255, 0.15)',
    padding: '20px',
    borderRadius: '8px',
    color: 'white',
    textAlign: 'left',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
  },
  billTitle: {
    marginBottom: '10px',
    fontSize: '1.5rem',
  },
};

const BillScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [bill, setBill] = useState('');
  const [uniqueCode, setUniqueCode] = useState('');

  const startScanning = () => {
    setScanning(true);
    axios.post('http://127.0.0.1:5000/api/start-scanning')
      .then((res) => console.log(res.data))
      .catch((err) => {
        console.error('Error starting scanning:', err);
        setScanning(false);
      });
  };

  const stopScanning = () => {
    setScanning(false);
    axios.post('http://127.0.0.1:5000/api/stop-scanning')
      .then((res) => console.log(res.data))
      .catch((err) => console.error('Error stopping scanning:', err));
  };

  const generateBill = () => {
    axios.get('http://127.0.0.1:5000/api/generate-bill')
      .then((res) => {
        setBill(res.data.bill);
        setUniqueCode(res.data.uniqueCode);
      })
      .catch((err) => console.error('Error generating bill:', err));
  };

  return (
    <div style={styles.cart}>
      <h1 style={styles.title}>🛒 Bill Scanning System</h1>
      <div style={styles.buttonContainer}>
        <button
          onClick={startScanning}
          disabled={scanning}
          style={styles.button(!scanning)}
        >
          Start Scanning
        </button>
        <button
          onClick={stopScanning}
          disabled={!scanning}
          style={styles.button(scanning)}
        >
          Stop Scanning
        </button>
        <button
          onClick={generateBill}
          disabled={scanning}
          style={styles.button(!scanning)}
        >
          Generate Bill
        </button>
      </div>
      {bill && (
        <div style={styles.bill}>
          <h2 style={styles.billTitle}>Bill</h2>
          <pre>{bill}</pre>
          <p>Unique Code: {uniqueCode}</p>
        </div>
      )}
    </div>
  );
};

export default BillScanner;