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
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center max-w-sm">
          <p className="text-gray-700 font-medium text-lg">Loading eCFR data...</p>
          <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-red-50 p-6 rounded-lg border border-red-200 shadow-sm">
            <h2 className="text-red-700 text-lg font-semibold mb-3">Error</h2>
            <p className="text-red-700 text-sm mb-4">Error loading dashboard: {error.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-md text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Clean and modern */}
      <header className="bg-indigo-600 shadow-md">
        <div className="max-w-5xl mx-auto px-4 w-full">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">eCFR Analyzer</h1>
              <span className="ml-2 px-2 py-1 bg-indigo-500 rounded-md text-xs text-indigo-100 font-medium">v{APP_VERSION}</span>
            </div>
            <div className="flex items-center">
              <a 
                href="https://github.com/sahilagar/ecfr-analyzer" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-100 hover:text-white transition-colors text-sm font-medium"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome / Introduction - Modern and informative */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Welcome to eCFR Analyzer</h2>
          <p className="text-gray-600 text-base mb-4">
            This tool helps you analyze the Electronic Code of Federal Regulations (eCFR) with data pulled directly from the official API.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center">
              <p className="text-gray-700">Explore regulations by agency</p>
            </div>
            <div className="flex items-center">
              <p className="text-gray-700">View word counts per title</p>
            </div>
            <div className="flex items-center">
              <p className="text-gray-700">Track historical corrections</p>
            </div>
            <div className="flex items-center">
              <p className="text-gray-700">View interactive visualizations</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Agency Selector Section */}
          <section>
            <AgencySelector 
              selectedAgency={selectedAgency}
              onAgencySelect={setSelectedAgency}
              agencies={agencies}
            />
          </section>

          {/* Dashboard Layout - Vertical for better content display */}
          <div className="space-y-8">
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
          <footer className="mt-12 bg-white shadow-sm rounded-lg p-4 text-center text-gray-500 text-sm border border-gray-200">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <div className="flex justify-center items-center mt-2 space-x-4">
              <span>eCFR Analyzer v{APP_VERSION}</span>
              <span>|</span>
              <a 
                href="https://github.com/sahilagar/ecfr-analyzer" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-500 hover:text-indigo-700 transition-colors"
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
