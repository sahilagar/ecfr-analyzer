// src/components/ChangeHistory.tsx
import React, { useState } from 'react';
import { useChangeHistory } from '../hooks/useChangeHistory';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type Granularity = 'day' | 'month' | 'year';
type DateRangePreset = 'all' | '1y' | '2y';

/** A single component that handles:
 *  1) Title selection
 *  2) Granularity toggles
 *  3) Date range presets
 */
export const ChangeHistory: React.FC = () => {
  // State for Title selection
  // undefined => All Titles
  const [titleNumber, setTitleNumber] = useState<number | undefined>(undefined);

  // Default to "month" granularity
  const [granularity, setGranularity] = useState<Granularity>('month');

  // Default to "all" time
  const [dateRange, setDateRange] = useState<DateRangePreset>('all');

  // Convert the dateRange preset into actual start/end dates
  const { startDate, endDate } = getDateRange(dateRange);

  // Fetch the corrections data
  const { trends, loading, error } = useChangeHistory(
    titleNumber,
    granularity,
    startDate,
    endDate
  );

  if (loading) return <div>Loading historical changes...</div>;
  if (error) return <div className="text-red-700">Error: {error}</div>;

  // Format the date for axis & tooltips
  const formatLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    if (granularity === 'day') {
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
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
        Historical Changes {titleNumber ? `(Title ${titleNumber})` : '(All Titles)'}
      </h2>

      {/* Title Selection */}
      <div className="flex items-center space-x-2 mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Title:
        </label>
        <select
          className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
          value={titleNumber || ''}
          onChange={(e) => {
            const val = e.target.value;
            setTitleNumber(val === '' ? undefined : Number(val));
          }}
        >
          <option value="">All Titles</option>
          {Array.from({ length: 50 }, (_, i) => i + 1).map((t) => (
            <option key={t} value={t}>
              Title {t}
            </option>
          ))}
        </select>
      </div>

      {/* Granularity & Date Range Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
        {/* Granularity radio buttons */}
        <div>
          <label className="mr-2 font-medium text-gray-700">Granularity:</label>
          {(['day', 'month', 'year'] as Granularity[]).map((g) => (
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
          {(['all', '1y', '2y'] as DateRangePreset[]).map((dr) => (
            <label key={dr} className="mr-2 text-sm">
              <input
                type="radio"
                name="dateRange"
                value={dr}
                checked={dateRange === dr}
                onChange={() => setDateRange(dr)}
                className="mr-1"
              />
              {dr === 'all'
                ? 'All Time'
                : dr === '1y'
                ? 'Past 1 Year'
                : 'Past 2 Years'}
            </label>
          ))}
        </div>
      </div>

      {/* Recharts Visualization */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trends}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" tickFormatter={formatLabel} />
          <YAxis allowDecimals={false} />
          <Tooltip labelFormatter={formatLabel} />
          <Line
            type="monotone"
            dataKey="changes"
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/** Convert a preset to a start/end date. */
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
