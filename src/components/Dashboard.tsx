// src/components/Dashboard.tsx
import React from 'react';
import { ChangeHistory } from './ChangeHistory';
import { AgencyMetrics } from './AgencyMetrics';
import { useECFRData } from '../hooks/useECFRData';

export const Dashboard: React.FC = () => {
  const { agencies, selectedAgency, setSelectedAgency, loading, error } = useECFRData();

  // Common styles for component containers
  const containerStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
    padding: '16px',
    marginBottom: '16px'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '20px 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px' }}>
        {/* Header and Agency Selector in one container */}
        <div style={{ ...containerStyle, textAlign: 'center' }}>
          <header style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
              eCFR Analyzer
            </h1>
            <p style={{ color: '#4b5563' }}>
              Visualizing the Electronic Code of Federal Regulations
            </p>
          </header>

          {/* Agency Selector */}
          <div style={{ 
            maxWidth: '500px', 
            margin: '0 auto',
            backgroundColor: 'white'
          }}>
            <label 
              htmlFor="agency-select" 
              style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px', textAlign: 'left' }}
            >
              Select an Agency:
            </label>
            <select
              id="agency-select"
              style={{ 
                width: '100%', 
                padding: '8px 12px', 
                borderRadius: '6px', 
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                fontSize: '0.875rem'
              }}
              value={selectedAgency || ''}
              onChange={(e) => setSelectedAgency(e.target.value || null)}
              disabled={loading}
            >
              <option value="">All Agencies</option>
              {agencies.map((agency) => (
                <option key={agency.id} value={agency.id}>
                  {agency.name}
                </option>
              ))}
            </select>
            {loading && <p style={{ marginTop: '4px', fontSize: '0.875rem', color: '#6b7280' }}>Loading agencies...</p>}
            {error && <p style={{ marginTop: '4px', fontSize: '0.875rem', color: '#ef4444' }}>Error: {error.message}</p>}
          </div>
        </div>

        {/* Metrics Components */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={containerStyle}>
            <AgencyMetrics selectedAgency={selectedAgency} />
          </div>
          <div style={containerStyle}>
            <ChangeHistory />
          </div>
        </div>
      </div>
    </div>
  );
};
