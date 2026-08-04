import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import App from './App.jsx';
import { themeConfig } from './theme.js';
import './index.css';

// StrictMode is a DEV-ONLY tool. It intentionally renders components twice
// and mounts/unmounts effects twice on the first render, specifically to
// surface side effects that are not "pure" or not properly cleaned up. It
// does nothing in production builds. Our useLocalStorage hook (see
// src/hooks/useLocalStorage.js) is written to survive this double-invoke
// safely — that's a deliberate design choice, not an accident.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={themeConfig}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
