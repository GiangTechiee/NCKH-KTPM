import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [health, setHealth] = useState(null);

  useEffect(() => {
    // Fetch welcome message
    fetch('/api')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error('Error:', err));

    // Fetch health status
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => console.error('Error:', err));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Frontend React App</h1>
        <p>{message || 'Loading...'}</p>
        {health && (
          <div className="health-status">
            <p>Backend Status: {health.status}</p>
            <p>Time: {new Date(health.timestamp).toLocaleString('vi-VN')}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
