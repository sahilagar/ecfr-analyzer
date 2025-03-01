// src/components/AgencySelector.tsx
import React from 'react';
import type { Agency } from '../utils/api';

interface AgencySelectorProps {
  selectedAgency: string | null;
  onAgencySelect: (agencyId: string | null) => void;
  agencies: Agency[];
}

export const AgencySelector: React.FC<AgencySelectorProps> = ({
  selectedAgency,
  onAgencySelect,
  agencies = []
}) => {
  // Sort agencies alphabetically by name
  const sortedAgencies = React.useMemo(
    () => [...agencies].sort((a, b) => a.name.localeCompare(b.name)),
    [agencies]
  );

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onAgencySelect(value === '' ? null : value);
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto',
      padding: '16px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb'
    }}>
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Select an Agency</h2>
      
      <div className="relative">
        <select
          id="agency-select"
          value={selectedAgency || ''}
          onChange={handleChange}
          style={{
            display: 'block',
            width: '100%',
            padding: '8px 12px',
            fontSize: '0.875rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            outline: 'none',
            appearance: 'none',
            backgroundColor: 'white'
          }}
        >
          <option key="default" value="">Select an agency...</option>
          {sortedAgencies.map((agency) => (
            <option key={agency.id} value={agency.id}>
              {agency.name} {agency.shortName ? `(${agency.shortName})` : ''}
            </option>
          ))}
        </select>
      </div>
      
      {/* Display selected agency info */}
      {selectedAgency && (
        <div style={{ marginTop: '12px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 12px',
            background: 'linear-gradient(to bottom right, #eef2ff, white)',
            border: '1px solid #e0e7ff',
            borderRadius: '8px',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}>
            <div>
              <div style={{ 
                fontSize: '0.75rem', 
                fontWeight: '500', 
                color: '#4f46e5', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em', 
                marginBottom: '4px'
              }}>Selected Agency</div>
              <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>
                {sortedAgencies.find(a => a.id === selectedAgency)?.name || selectedAgency}
              </div>
            </div>
            <button 
              onClick={() => onAgencySelect(null)}
              style={{
                fontSize: '0.75rem',
                color: 'white',
                backgroundColor: '#4f46e5',
                padding: '4px 8px',
                borderRadius: '6px',
                fontWeight: '500',
                transition: 'background-color 150ms'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
