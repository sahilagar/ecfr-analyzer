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
    console.log('Selected agency ID:', value);
    onAgencySelect(value === '' ? null : value);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <label 
        htmlFor="agency-select" 
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Select Agency
      </label>
      <select
        id="agency-select"
        value={selectedAgency || ''}
        onChange={handleChange}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
      >
        <option key="default" value="">Select an agency...</option>
        {sortedAgencies.map((agency) => (
          <option key={agency.id} value={agency.id}>
            {agency.name}{agency.shortName ? ` (${agency.shortName})` : ''}
          </option>
        ))}
      </select>
      
      {/* Debug info */}
      <div className="mt-2 text-xs text-gray-500">
        {selectedAgency && `Selected Agency ID: ${selectedAgency}`}
      </div>
    </div>
  );
};
