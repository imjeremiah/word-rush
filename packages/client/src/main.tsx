/**
 * Word Rush Client - Main Entry Point
 * Initializes the React application and renders the root component
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './App.css';

// 🧪 Load edge case testing utilities in development
if (process.env.NODE_ENV === 'development') {
  import('./services/edgeCaseTestUtils.js');
}

// 📊 Load synchronization monitoring service
import('./services/syncMonitoring.js');

// 🏥 Load deployment health and rollback service
import('./services/deploymentHealthCheck.js');

const root = createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
