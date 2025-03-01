// src/components/ChangeHistory.tsx
import React, { useState, useEffect } from 'react';
import { useChangeHistory } from '../hooks/useChangeHistory';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Granularity = 'day' | 'month' | 'year';
type DateRangePreset = 'all' | '1y' | '2y';

// Titles known to have issues with the eCFR API
const EXCLUDED_TITLES = [35];

/** A component for visualizing historical corrections to the eCFR */
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

  // Format the date for display
  const formatLabel = (dateStr: string) => {
    if (!dateStr) return '';
    
    const d = new Date(dateStr);
    if (granularity === 'day') {
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } else if (granularity === 'month') {
      return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    } else {
      // year
      return String(d.getUTCFullYear());
    }
  };

  // Handle title change
  const handleTitleChange = (value: string) => {
    const val = value === '' ? undefined : Number(value);
    setTitleNumber(val);
  };

  // Generate title options, excluding problematic titles
  const getTitleOptions = () => {
    return Array.from({ length: 50 }, (_, i) => i + 1)
      .filter(title => !EXCLUDED_TITLES.includes(title))
      .map(title => (
        <option key={title} value={title}>
          Title {title}
        </option>
      ));
  };

  // Prepare chart data
  const chartData = {
    labels: trends.map(item => formatLabel(item.date)),
    datasets: [
      {
        label: 'Corrections',
        data: trends.map(item => item.changes),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 3,
        tension: 0.1,
        fill: false,
      },
    ],
  };

  // Chart options
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        titleFont: {
          size: 12,
        },
        bodyFont: {
          size: 11,
        },
        padding: 8,
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return `${value} ${value === 1 ? 'correction' : 'corrections'}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          maxRotation: 0,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          font: {
            size: 10,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  return (
    <div className="bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Historical Changes {titleNumber ? `(Title ${titleNumber})` : '(All Titles)'}
      </h2>

      {/* Controls Section */}
      <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Title selector */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Title:</label>
          <div className="relative">
            <select
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm appearance-none bg-white"
              value={titleNumber || ''}
              onChange={(e) => handleTitleChange(e.target.value)}
            >
              <option value="">All Titles</option>
              {getTitleOptions()}
            </select>
          </div>
        </div>

        {/* Granularity selector */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Time Interval:</label>
          <div className="flex space-x-2">
            <button
              onClick={() => setGranularity('day')}
              className={`flex-1 py-2 px-3 text-sm ${
                granularity === 'day'
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setGranularity('month')}
              className={`flex-1 py-2 px-3 text-sm ${
                granularity === 'month'
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setGranularity('year')}
              className={`flex-1 py-2 px-3 text-sm ${
                granularity === 'year'
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        {/* Date range selector */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Time Period:</label>
          <div className="flex space-x-2">
            <button
              onClick={() => setDateRange('all')}
              className={`flex-1 py-2 px-3 text-sm ${
                dateRange === 'all'
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setDateRange('1y')}
              className={`flex-1 py-2 px-3 text-sm ${
                dateRange === '1y'
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              1 Year
            </button>
            <button
              onClick={() => setDateRange('2y')}
              className={`flex-1 py-2 px-3 text-sm ${
                dateRange === '2y'
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              2 Years
            </button>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div 
        className="bg-white border border-gray-200 p-3 mb-4"
        style={{ height: '280px' }}
      >
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-700">Loading data...</p>
            </div>
          </div>
        )}

        {/* Generic error handling for any title */}
        {error && !loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <p className="text-gray-700 mb-1">
                {titleNumber ? `Title ${titleNumber} Data Unavailable` : 'Data Unavailable'}
              </p>
              <p className="text-gray-600 mb-2">
                {titleNumber 
                  ? `Title ${titleNumber} appears to be missing from the eCFR API.`
                  : 'The requested data appears to be missing from the eCFR API.'}
              </p>
              {titleNumber && (
                <button
                  onClick={() => setTitleNumber(undefined)}
                  className="bg-gray-200 text-gray-700 py-1 px-3 text-xs"
                >
                  View All Titles
                </button>
              )}
            </div>
          </div>
        )}

        {!loading && !error && trends.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <p className="text-gray-500">No changes found</p>
              <p className="text-gray-400">Try selecting a different title or time period.</p>
            </div>
          </div>
        )}

        {/* Chart.js Line Chart */}
        {!loading && !error && trends.length > 0 && (
          <div className="h-full w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}
      </div>

      {/* Summary Section - Simplified */}
      {!loading && !error && trends.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-100 p-4">
            <p className="text-xs text-gray-700 uppercase mb-1">Total Corrections</p>
            <p className="text-2xl font-semibold text-gray-800">
              {trends.reduce((sum, item) => sum + item.changes, 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {trends.length > 0 
                ? `${formatLabel(trends[0].date)} - ${formatLabel(trends[trends.length - 1].date)}`
                : 'N/A'}
            </p>
          </div>
          <div className="bg-gray-100 p-4">
            <p className="text-xs text-gray-700 uppercase mb-1">Average per {granularity}</p>
            <p className="text-2xl font-semibold text-gray-800">
              {trends.length ? (trends.reduce((sum, item) => sum + item.changes, 0) / trends.length).toFixed(1) : '0'}
            </p>
            <p className="text-xs text-gray-600 mt-1">corrections</p>
          </div>
          <div className="bg-gray-100 p-4">
            <p className="text-xs text-gray-700 uppercase mb-1">Peak Corrections</p>
            <p className="text-2xl font-semibold text-gray-800">
              {trends.length ? Math.max(...trends.map(item => item.changes)).toLocaleString() : '0'}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {trends.length > 0 
                ? `on ${formatLabel(trends.find(item => 
                    item.changes === Math.max(...trends.map(t => t.changes))
                  )?.date || '')}`
                : 'N/A'}
            </p>
          </div>
        </div>
      )}
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
