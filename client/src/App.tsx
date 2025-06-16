import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [apiMessage, setApiMessage] = useState('');

  const checkConnection = async () => {
    try {
      const res = await fetch('/api/test', { cache: "no-store" });
      if (!res.ok) {
        setApiMessage('Backend returned error: ' + res.status);
        return;
      }
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        setApiMessage(data.message || 'No message');
      } catch {
        setApiMessage('Backend did not return valid JSON: ' + text);
      }
    } catch (err) {
      setApiMessage('Error connecting to backend');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <h1>Weather Reporter</h1>
      <button onClick={checkConnection}>Check Backend Connection</button>
      <div>{apiMessage}</div>
    </div>
  );
}

export default App;
