// src/components/Dashboard.tsx

import React from 'react';
import { AgencySelector } from './AgencySelector';
import { useECFRData } from '../hooks/useECFRData';
import { AgencyMetrics } from './AgencyMetrics';

export const Dashboard: React.FC = () => {
  const { loading, error, agencies, selectedAgency, setSelectedAgency } = useECFRData();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">Error loading dashboard: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                eCFR Analyzer
              </h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Agency Selection */}
          <section>
          <AgencySelector 
            selectedAgency={selectedAgency}
            onAgencySelect={setSelectedAgency}
            agencies={agencies}
            />
          </section>

          {/* Agency Metrics */}
          <section>
            <AgencyMetrics selectedAgency={selectedAgency} />
          </section>

          {/* Change History - Placeholder */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Historical Changes
            </h2>
            <p className="text-gray-500">
              Timeline of regulatory changes will appear here
            </p>
          </section>

          {/* Cross References - Placeholder */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Cross References
            </h2>
            <p className="text-gray-500">
              Reference network visualization will appear here
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};