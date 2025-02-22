// src/components/AgencyMetrics.tsx

import React from 'react';
import { useWordCount } from '../hooks/useWordCount';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AgencyMetricsProps {
  selectedAgency: string | null;
}

const AgencyMetrics: React.FC<AgencyMetricsProps> = ({ selectedAgency }) => {
  const { wordCountData, loading, error } = useWordCount(selectedAgency);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-red-600">
          Error loading metrics: {error.message}
        </div>
      </div>
    );
  }

  if (!wordCountData) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">Select an agency to view metrics</p>
      </div>
    );
  }

  const chartData = wordCountData.titleBreakdown.map(title => ({
    title: `Title ${title.titleId}`,
    words: title.wordCount
  }));

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Word Count Analysis</h2>
        
        <div className="space-y-6 mt-4">
          {/* Summary Stats */}
          <div>
            <p className="text-3xl font-semibold text-indigo-600">
              {wordCountData.totalWords.toLocaleString()} words
            </p>
            <p className="text-sm text-gray-500">
              Across {wordCountData.titleBreakdown.length} titles
            </p>
          </div>

          {/* Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="title"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="words" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Title Breakdown */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Title Breakdown</h4>
            <div className="max-h-64 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Word Count
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {wordCountData.titleBreakdown.map((title) => (
                    <tr key={title.titleId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Title {title.titleId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {title.wordCount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AgencyMetrics };
export default AgencyMetrics;