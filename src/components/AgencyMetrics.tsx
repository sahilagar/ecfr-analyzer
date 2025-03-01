import React from 'react';
import { useWordCount } from '../hooks/useWordCount';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface AgencyMetricsProps {
  selectedAgency: string | null;
}

export const AgencyMetrics: React.FC<AgencyMetricsProps> = ({ selectedAgency }) => {
  const { wordCounts, loading, error } = useWordCount(selectedAgency);

  if (!selectedAgency) {
    return (
      <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Agency Word Count</h2>
        <div className="flex items-center justify-center h-56 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-gray-500 text-sm">Select an agency to view metrics</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Agency Word Count</h2>
        <div className="flex items-center justify-center h-56 bg-gray-50 rounded-md border border-gray-200">
          <div className="text-center">
            <p className="text-gray-700 mb-2">Loading...</p>
            <p className="text-gray-500 text-sm">Please wait while we fetch the data</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Agency Word Count</h2>
        <div className="p-4 bg-red-50 rounded-md border border-red-200">
          <p className="text-red-700 text-sm">Error fetching word counts: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-1.5 px-3 rounded-md text-xs transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Handle case where no data was found
  if (!wordCounts.length) {
    return (
      <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Agency Word Count</h2>
        <div className="flex items-center justify-center h-56 bg-gray-50 rounded-md border border-gray-200">
          <div className="text-center p-4">
            <p className="text-gray-500 text-sm mb-1">No titles found for this agency</p>
            <p className="text-gray-400 text-xs">The selected agency may not have any associated titles in the eCFR.</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if all entries have errors (complete data failure)
  const allErrors = wordCounts.every(item => Boolean(item.error));
  if (allErrors) {
    return (
      <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Agency Word Count</h2>
        <div className="p-4 bg-red-50 rounded-md border border-red-200 text-center">
          <p className="text-red-700 text-sm mb-1">Unable to retrieve data for any titles</p>
          <p className="text-red-600 text-xs mb-2">There may be an issue with the eCFR API or the titles may not exist.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-100 hover:bg-red-200 text-red-700 font-medium py-1.5 px-3 rounded-md text-xs transition-colors"
          >
            Retry
          </button>
        </div>
        
        <div className="mt-4">
          <h3 className="text-xs font-medium text-gray-700 mb-2">Error Details:</h3>
          <ul className="bg-gray-50 rounded-md p-3 text-xs border border-gray-200 max-h-32 overflow-y-auto">
            {wordCounts.map(({ titleNumber, error }) => (
              <li key={titleNumber} className="text-gray-700 mb-1">
                <span className="font-medium">Title {titleNumber}:</span> {error}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // Format data for the chart - skip items with errors
  const chartData = wordCounts
    .filter(item => !item.error) // Only include successful counts
    .sort((a, b) => Number(a.titleNumber) - Number(b.titleNumber)) // Sort by title number
    .map(item => ({
      title: `${item.titleNumber}`,
      count: item.count,
      titleNumber: item.titleNumber
    }));

  // If there are any errors, show them below the chart
  const errorItems = wordCounts.filter(item => item.error);

  // Calculate total word count (only from successful items)
  const totalWordCount = wordCounts.reduce((sum, item) => sum + (item.error ? 0 : item.count), 0);
  
  const getBarColor = (index: number) => {
    // Use a simpler, more cohesive color scheme
    return index % 2 === 0 ? 'rgb(79, 70, 229)' : 'rgb(99, 102, 241)';
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Agency Word Count</h2>
      
      {/* Summary metrics */}
      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-indigo-50 p-4 rounded-md border border-indigo-100 shadow-sm">
            <p className="text-xs text-indigo-700 uppercase font-medium mb-1">Titles</p>
            <p className="text-2xl font-semibold text-indigo-800">{chartData.length}</p>
            {errorItems.length > 0 && (
              <p className="text-xs text-indigo-600 mt-1">
                ({errorItems.length} unavailable)
              </p>
            )}
          </div>
          <div className="bg-indigo-50 p-4 rounded-md border border-indigo-100 shadow-sm">
            <p className="text-xs text-indigo-700 uppercase font-medium mb-1">Total Words</p>
            <p className="text-2xl font-semibold text-indigo-800">{totalWordCount.toLocaleString()}</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-md border border-indigo-100 shadow-sm">
            <p className="text-xs text-indigo-700 uppercase font-medium mb-1">Average per Title</p>
            <p className="text-2xl font-semibold text-indigo-800">
              {chartData.length ? Math.round(totalWordCount / chartData.length).toLocaleString() : '0'}
            </p>
            <p className="text-xs text-indigo-600 mt-1">words</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="mt-4 bg-white rounded-md border border-gray-200 p-3" style={{ height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
              <XAxis 
                dataKey="title" 
                angle={0} 
                textAnchor="middle" 
                height={25} 
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                label={{ value: 'Title', position: 'insideBottom', offset: -15, fontSize: 10 }}
              />
              <YAxis 
                tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}
                tick={{ fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip 
                formatter={(value) => [`${Number(value).toLocaleString()} words`, 'Word Count']}
                labelFormatter={(value) => `Title ${value}`}
                contentStyle={{ fontSize: 11, padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px' }}
              />
              <Bar 
                dataKey="count" 
                barSize={chartData.length > 10 ? 12 : 24} 
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-56 bg-gray-50 rounded-md border border-gray-200 mt-4">
          <p className="text-gray-500 text-sm">No title data available to display</p>
        </div>
      )}

      {/* Error items */}
      {errorItems.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xs font-medium text-red-700 mb-2">
            Titles with Errors ({errorItems.length}):
          </h3>
          <ul className="bg-red-50 rounded-md p-3 text-xs border border-red-200 max-h-32 overflow-y-auto">
            {errorItems.map(({ titleNumber, error }) => (
              <li key={titleNumber} className="text-red-700 mb-1 flex items-start">
                <span className="font-medium mr-1 whitespace-nowrap">Title {titleNumber}:</span> 
                <span className="text-red-600">{error}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 mt-1">
            Some titles may not be available in the eCFR.
          </p>
        </div>
      )}
    </div>
  );
};
