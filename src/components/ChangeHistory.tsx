// src/components/ChangeHistory.tsx
import React, { useState } from 'react';
import { useChangeHistory, TrendData } from '../hooks/useChangeHistory';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChangeHistoryProps {
  titleNumber?: number;  // If provided, fetch corrections for that title
}

type Granularity = 'day' | 'month' | 'year';
type DateRangePreset = 'all' | '1y' | '2y';

export const ChangeHistory: React.FC<ChangeHistoryProps> = ({ titleNumber }) => {
  // Granularity & date range states
  const [granularity, setGranularity] = useState<Granularity>('day');
  const [dateRange, setDateRange] = useState<DateRangePreset>('all');

  // Compute the actual start/end date based on the preset
  const { startDate, endDate } = getDateRange(dateRange);

  // Fetch corrections with chosen granularity and date range
  const { trends, loading, error } = useChangeHistory(titleNumber, granularity, startDate, endDate);

  if (loading) return <div>Loading historical changes...</div>;
  if (error) return <div className="text-red-700">Error: {error}</div>;

  // Format the date for X-axis & tooltips
  const formatLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    if (granularity === 'day') {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } else if (granularity === 'month') {
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } else {
      // year
      return String(d.getUTCFullYear());
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Historical Changes {titleNumber ? `(Title ${titleNumber})` : '(All)'}
      </h2>

      {/* Controls: Granularity & Date Range */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
        {/* Granularity radio buttons */}
        <div>
          <label className="mr-2 font-medium text-gray-700">Granularity:</label>
          {(['day', 'month', 'year'] as Granularity[]).map(g => (
            <label key={g} className="mr-2 text-sm">
              <input
                type="radio"
                name="granularity"
                value={g}
                checked={granularity === g}
                onChange={() => setGranularity(g)}
                className="mr-1"
              />
              {g}
            </label>
          ))}
        </div>

        {/* Date range presets */}
        <div>
          <label className="mr-2 font-medium text-gray-700">Date Range:</label>
          {(['all', '1y', '2y'] as DateRangePreset[]).map(dr => (
            <label key={dr} className="mr-2 text-sm">
              <input
                type="radio"
                name="dateRange"
                value={dr}
                checked={dateRange === dr}
                onChange={() => setDateRange(dr)}
                className="mr-1"
              />
              {dr === 'all' ? 'All Time' : dr === '1y' ? 'Past 1 Year' : 'Past 2 Years'}
            </label>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trends}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" tickFormatter={formatLabel} />
          <YAxis allowDecimals={false} />
          <Tooltip labelFormatter={formatLabel} />
          <Line type="monotone" dataKey="changes" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/** Helper to return a start/end date based on the preset selection. */
function getDateRange(preset: DateRangePreset): { startDate?: Date; endDate?: Date } {
  const now = new Date();
  if (preset === 'all') {
    return {}; // no filtering
  } else if (preset === '1y') {
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return { startDate: oneYearAgo, endDate: now };
  } else {
    // '2y'
    const twoYearsAgo = new Date(now);
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    return { startDate: twoYearsAgo, endDate: now };
  }
}
