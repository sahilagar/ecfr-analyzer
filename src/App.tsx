// src/App.tsx
import React from 'react';
import { AgencySelector } from './components/AgencySelector';

function App() {
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
            <AgencySelector />
          </section>

          {/* Placeholder for metrics and visualizations */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Agency Metrics
            </h2>
            <p className="text-gray-500">
              Metrics and visualizations will appear here
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;