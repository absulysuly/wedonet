import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { CityProvider } from './contexts/CityContext';
import { LocaleProvider } from './contexts/LocaleContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LocaleProvider>
      <AuthProvider>
        <CityProvider>
          <App />
        </CityProvider>
      </AuthProvider>
    </LocaleProvider>
  </React.StrictMode>
);
