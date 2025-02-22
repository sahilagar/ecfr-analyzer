import React from 'react';
import { useWordCount } from '../hooks/useWordCount';

interface AgencyMetricsProps {
  selectedAgency: string | null;
}

export const AgencyMetrics: React.FC<AgencyMetricsProps> = ({ selectedAgency }) => {
  const { wordCounts, loading, error } = useWordCount(selectedAgency);

  if (!selectedAgency) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">No agency selected.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">Loading word counts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-red-700">Error fetching word counts: {error}</p>
      </div>
    );
  }

  if (!wordCounts.length) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">No titles found for this agency.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Agency Metrics</h2>
      <ul>
        {wordCounts.map(({ titleNumber, count, error: titleError }) => (
          <li key={titleNumber}>
            {titleError
              ? <span className="text-red-700">Title {titleNumber}: Error - {titleError}</span>
              : <span>Title {titleNumber}: Word Count = {count}</span>
            }
          </li>
        ))}
      </ul>
    </div>
  );
};
