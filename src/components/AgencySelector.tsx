// src/components/AgencySelector.tsx
import React from 'react';
import { useECFRData } from '../hooks/useECFRData';

export const AgencySelector: React.FC = () => {
  const { agencies, loading, error, selectedAgency, setSelectedAgency } = useECFRData();

  if (loading) {
    return (
      <div className="w-full max-w-md animate-pulse">
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md p-4 text-red-600 bg-red-50 rounded">
        <p>Error loading agencies: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <label htmlFor="agency-select" className="block text-sm font-medium text-gray-700 mb-2">
        Select Agency
      </label>
      <select
        id="agency-select"
        value={selectedAgency || ''}
        onChange={(e) => setSelectedAgency(e.target.value)}
        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">Select an agency...</option>
        {agencies.map((agency) => (
          <option key={agency.id || agency.name} value={agency.id || agency.name}>
            {agency.name}
          </option>
        ))}
      </select>
    </div>
  );
};