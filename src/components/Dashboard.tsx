// src/components/Dashboard.tsx
import React from 'react';
import { AgencySelector } from './AgencySelector';
import { useECFRData } from '../hooks/useECFRData';
import { AgencyMetrics } from './AgencyMetrics';
import { ChangeHistory } from './ChangeHistory';

const APP_VERSION = '1.0.0'; // Add version number for tracking

export const Dashboard: React.FC = () => {
  const { loading, error, agencies, selectedAgency, setSelectedAgency } = useECFRData();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '320px' }}>
          <p style={{ color: '#374151', fontWeight: '500', fontSize: '1.125rem' }}>Loading eCFR data...</p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '8px' }}>This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ maxWidth: '448px', width: '100%', margin: '0 auto', padding: '0 16px' }}>
          <div style={{
            backgroundColor: '#fef2f2',
            padding: '24px',
            borderRadius: '8px',
            border: '1px solid #fee2e2',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}>
            <h2 style={{ color: '#b91c1c', fontSize: '1.125rem', fontWeight: '600', marginBottom: '12px' }}>Error</h2>
            <p style={{ color: '#b91c1c', fontSize: '0.875rem', marginBottom: '16px' }}>Error loading dashboard: {error.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                fontWeight: '500',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.875rem',
                transition: 'background-color 150ms'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header - Clean and modern */}
      <header style={{ backgroundColor: '#4f46e5', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', height: '56px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h1 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'white' }}>eCFR Analyzer</h1>
              <span style={{ 
                marginLeft: '8px', 
                padding: '2px 8px', 
                backgroundColor: '#4338ca', 
                borderRadius: '6px', 
                fontSize: '0.75rem', 
                color: '#e0e7ff', 
                fontWeight: '500' 
              }}>v{APP_VERSION}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <a 
                href="https://github.com/sahilagar/ecfr-analyzer" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#e0e7ff', fontSize: '0.875rem', fontWeight: '500', transition: 'color 150ms' }}
                onMouseOver={(e) => e.currentTarget.style.color = 'white'}
                onMouseOut={(e) => e.currentTarget.style.color = '#e0e7ff'}
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
        {/* Welcome / Introduction - Modern and informative */}
        <div style={{ 
          backgroundColor: 'white', 
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', 
          borderRadius: '8px', 
          padding: '16px', 
          marginBottom: '16px', 
          border: '1px solid #e5e7eb' 
        }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Welcome to eCFR Analyzer</h2>
          <p style={{ color: '#4b5563', fontSize: '0.875rem', marginBottom: '12px' }}>
            This tool helps you analyze the Electronic Code of Federal Regulations (eCFR) with data pulled directly from the official API.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '16px', rowGap: '4px', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ color: '#374151', fontSize: '0.875rem' }}>Explore regulations by agency</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ color: '#374151', fontSize: '0.875rem' }}>View word counts per title</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ color: '#374151', fontSize: '0.875rem' }}>Track historical corrections</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ color: '#374151', fontSize: '0.875rem' }}>View interactive visualizations</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Agency Selector Section */}
          <section>
            <AgencySelector 
              selectedAgency={selectedAgency}
              onAgencySelect={setSelectedAgency}
              agencies={agencies}
            />
          </section>

          {/* Dashboard Layout - Vertical for better content display */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Agency Metrics */}
            <section>
              <AgencyMetrics selectedAgency={selectedAgency} />
            </section>

            {/* Change History */}
            <section>
              <ChangeHistory />
            </section>
          </div>
          
          {/* Footer - Clean and professional */}
          <footer style={{ 
            marginTop: '24px', 
            backgroundColor: 'white', 
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', 
            borderRadius: '8px', 
            padding: '12px', 
            textAlign: 'center', 
            color: '#6b7280', 
            fontSize: '0.75rem', 
            border: '1px solid #e5e7eb' 
          }}>
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '4px', gap: '12px' }}>
              <span>eCFR Analyzer v{APP_VERSION}</span>
              <span>|</span>
              <a 
                href="https://github.com/sahilagar/ecfr-analyzer" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#4f46e5', transition: 'color 150ms' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#4338ca'}
                onMouseOut={(e) => e.currentTarget.style.color = '#4f46e5'}
              >
                GitHub
              </a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
