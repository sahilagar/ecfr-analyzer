// src/components/Dashboard.tsx
import React, { useState } from 'react';
import { ChangeHistory } from './ChangeHistory';
import { AgencyMetrics } from './AgencyMetrics';
import { useECFRData } from '../hooks/useECFRData';

export const Dashboard: React.FC = () => {
  const { agencies, selectedAgency, setSelectedAgency, loading, error } = useECFRData();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">eCFR Analyzer</h1>
        <p className="text-gray-600">Visualizing the Electronic Code of Federal Regulations</p>
      </header>

      {/* Agency Selector */}
      <div className="max-w-md mx-auto mb-8">
        <label htmlFor="agency-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select an Agency:
        </label>
        <select
          id="agency-select"
          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
        {loading && <p className="mt-1 text-sm text-gray-500">Loading agencies...</p>}
        {error && <p className="mt-1 text-sm text-red-500">Error: {error.message}</p>}
      </div>

      {/* Metrics Components */}
      <div className="space-y-8">
        <AgencyMetrics selectedAgency={selectedAgency} />
        <ChangeHistory />
      </div>
    </div>
  );
};
