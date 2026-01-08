import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuditProvider } from './context/AuditContext';
import Home from './pages/Home';
import DomainAssessment from './pages/DomainAssessment';
import Results from './pages/Results';

function App() {
  return (
    <AuditProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assessment" element={<DomainAssessment />} />
          <Route path="/assessment/:domainId" element={<DomainAssessment />} />
          <Route path="/results" element={<Results />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuditProvider>
  );
}

export default App;
