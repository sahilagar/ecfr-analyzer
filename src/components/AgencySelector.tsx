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
    <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Select an Agency</h2>
      
      <div className="relative">
        <select
          id="agency-select"
          value={selectedAgency || ''}
          onChange={handleChange}
          className="block w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
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
        <div className="mt-4">
          <div className="flex justify-between items-center py-3 px-4 bg-indigo-50 border border-indigo-100 rounded-md shadow-sm">
            <div>
              <div className="text-xs text-indigo-700 uppercase font-medium mb-1">Selected Agency</div>
              <div className="text-sm text-indigo-900 font-medium">
                {sortedAgencies.find(a => a.id === selectedAgency)?.name || selectedAgency}
              </div>
            </div>
            <button 
              onClick={() => onAgencySelect(null)}
              className="text-xs text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 rounded-md transition-colors font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
