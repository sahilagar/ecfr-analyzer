// src/components/ChangeHistory.tsx
import React, { useState, useEffect, useCallback } from 'react';
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

  // State for chart height
  const [chartHeight, setChartHeight] = useState<string>(calculateChartHeight());

  // Convert the dateRange preset into actual start/end dates
  const { startDate, endDate } = getDateRange(dateRange);

  // Fetch the corrections data
  const { trends, loading, error } = useChangeHistory(
    titleNumber,
    granularity,
    startDate,
    endDate
  );

  // Handle window resize
  const handleResize = useCallback(() => {
    setChartHeight(calculateChartHeight());
  }, []);

  // Add resize listener
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // Format the date for display
  const formatLabel = (dateStr: string) => {
    if (!dateStr) return '';
    
    const d = new Date(dateStr);
    if (granularity === 'day') {
      // For daily view, use more compact format
      const month = d.toLocaleDateString('en-US', { month: 'short' });
      const day = d.getDate();
      return `${month} ${day}`;
    } else if (granularity === 'month') {
      // For monthly view, use abbreviated month and year
      return d.toLocaleDateString('en-US', { 
        month: 'short', 
        year: '2-digit' 
      });
    } else {
      // For yearly view, just show the year
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

  // Prepare chart data with adjusted configuration for better vertical display
  const chartData = {
    labels: trends.map(item => formatLabel(item.date)),
    datasets: [
      {
        label: 'Corrections',
        data: trends.map(item => item.changes),
        borderColor: 'rgb(79, 70, 229)', // Indigo-600
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        borderWidth: 2,
        pointRadius: calculatePointRadius(trends.length),
        pointHoverRadius: 5,
        tension: 0.3,
        fill: {
          target: 'origin',
          above: 'rgba(79, 70, 229, 0.08)', // Lighter fill for better visibility
        },
        pointBackgroundColor: 'rgb(79, 70, 229)',
        pointBorderColor: 'white',
        pointBorderWidth: 1,
        cubicInterpolationMode: 'monotone' as const,
      },
    ],
  };

  // Calculate the maximum value for better y-axis scaling
  const maxValue = !loading && !error && trends.length > 0
    ? Math.max(...trends.map(item => item.changes))
    : 0;
  
  // Calculate suggested y-axis max value to create more vertical space
  const suggestedMax = calculateSuggestedMax(maxValue);

  // Chart options with improved vertical scaling
  const chartOptions: ChartOptions<'line'> = {
    responsive: false, // Set to false for fixed size
    maintainAspectRatio: false, // Not needed when responsive is false
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
          maxRotation: 45,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: calculateMaxTicksLimit(trends.length),
          align: 'start',
          color: '#6b7280',
        },
        border: {
          display: true,
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: suggestedMax,
        ticks: {
          precision: 0,
          font: {
            size: 10,
          },
          color: '#6b7280',
          padding: 10,
          stepSize: Math.max(1, Math.ceil(maxValue / 10)),
          count: 10,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawTicks: true,
          tickLength: 5,
        },
        border: {
          display: true,
        },
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 20,
        top: 30,
        bottom: 30
      }
    },
    elements: {
      line: {
        tension: 0.3,
      },
      point: {
        radius: calculatePointRadius(trends.length),
        hoverRadius: 5,
        hitRadius: 10,
      }
    },
  };

  // Helper function to calculate suggested max value for y-axis
  function calculateSuggestedMax(maxValue: number): number {
    if (maxValue <= 5) return maxValue + 5; // Add more space for small values
    if (maxValue <= 10) return maxValue + 8;
    if (maxValue <= 20) return maxValue + 15;
    if (maxValue <= 50) return maxValue + 25;
    return maxValue * 1.5; // Add 50% more space for large values
  }

  // Helper function to calculate appropriate max ticks based on data length
  function calculateMaxTicksLimit(dataLength: number): number {
    if (dataLength <= 12) return dataLength;
    if (dataLength <= 30) return Math.ceil(dataLength / 2);
    if (dataLength <= 60) return Math.ceil(dataLength / 3);
    if (dataLength <= 100) return Math.ceil(dataLength / 5);
    return Math.ceil(dataLength / 10);
  }

  // Helper function to calculate appropriate point radius based on data density
  function calculatePointRadius(dataLength: number): number {
    if (dataLength <= 20) return 3;
    if (dataLength <= 50) return 2;
    if (dataLength <= 100) return 1.5;
    return 1;
  }

  // Calculate summary metrics
  const totalCorrections = !loading && !error && trends.length > 0
    ? trends.reduce((sum, item) => sum + item.changes, 0)
    : 0;
    
  const averagePerPeriod = !loading && !error && trends.length > 0
    ? (totalCorrections / trends.length).toFixed(1)
    : '0';
    
  const peakCorrections = !loading && !error && trends.length > 0
    ? Math.max(...trends.map(item => item.changes))
    : 0;
    
  const peakDate = !loading && !error && trends.length > 0
    ? formatLabel(trends.find(item => item.changes === peakCorrections)?.date || '')
    : 'N/A';
    
  const dateRangeText = !loading && !error && trends.length > 0
    ? `${formatLabel(trends[0].date)} - ${formatLabel(trends[trends.length - 1].date)}`
    : 'N/A';

  return (
    <div style={{ 
      maxWidth: '900px',
      margin: '0 auto',
      padding: '16px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb'
    }}>
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Historical Changes {titleNumber ? `(Title ${titleNumber})` : '(All Titles)'}
      </h2>

      {/* Controls Section - More responsive layout */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Title selector */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Title:</label>
          <div className="relative">
            <select
              className="w-full border border-gray-300 rounded-md py-1.5 px-2 text-sm appearance-none bg-white"
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
          <div className="flex space-x-1">
            <button
              onClick={() => setGranularity('day')}
              className={`flex-1 py-1.5 px-2 text-sm rounded-md transition-all ${
                granularity === 'day'
                  ? 'bg-indigo-100 text-indigo-700 font-medium border border-indigo-200'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setGranularity('month')}
              className={`flex-1 py-1.5 px-2 text-sm rounded-md transition-all ${
                granularity === 'month'
                  ? 'bg-indigo-100 text-indigo-700 font-medium border border-indigo-200'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setGranularity('year')}
              className={`flex-1 py-1.5 px-2 text-sm rounded-md transition-all ${
                granularity === 'year'
                  ? 'bg-indigo-100 text-indigo-700 font-medium border border-indigo-200'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        {/* Date range selector */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Time Period:</label>
          <div className="flex space-x-1">
            <button
              onClick={() => setDateRange('all')}
              className={`flex-1 py-1.5 px-2 text-sm rounded-md transition-all ${
                dateRange === 'all'
                  ? 'bg-indigo-100 text-indigo-700 font-medium border border-indigo-200'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setDateRange('1y')}
              className={`flex-1 py-1.5 px-2 text-sm rounded-md transition-all ${
                dateRange === '1y'
                  ? 'bg-indigo-100 text-indigo-700 font-medium border border-indigo-200'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              1 Year
            </button>
            <button
              onClick={() => setDateRange('2y')}
              className={`flex-1 py-1.5 px-2 text-sm rounded-md transition-all ${
                dateRange === '2y'
                  ? 'bg-indigo-100 text-indigo-700 font-medium border border-indigo-200'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              2 Years
            </button>
          </div>
        </div>
      </div>

      {/* Summary Metrics - Responsive grid */}
      {!loading && !error && trends.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '12px', 
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'linear-gradient(to bottom right, #eef2ff, white)',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #e0e7ff',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}>
            <div>
              <p style={{ 
                fontSize: '0.75rem', 
                fontWeight: '500', 
                color: '#4f46e5', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em', 
                marginBottom: '4px'
              }}>Total</p>
              <p style={{ 
                fontSize: '1.5rem', 
                fontWeight: '800', 
                color: '#1f2937'
              }}>
                {totalCorrections.toLocaleString()}
              </p>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>{dateRangeText}</p>
          </div>
          
          <div style={{
            background: 'linear-gradient(to bottom right, #eff6ff, white)',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #dbeafe',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}>
            <div>
              <p style={{ 
                fontSize: '0.75rem', 
                fontWeight: '500', 
                color: '#2563eb', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em', 
                marginBottom: '4px'
              }}>Average</p>
              <p style={{ 
                fontSize: '1.5rem', 
                fontWeight: '800', 
                color: '#1f2937'
              }}>
                {averagePerPeriod}
              </p>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>per {granularity}</p>
          </div>
          
          <div style={{
            background: 'linear-gradient(to bottom right, #f5f3ff, white)',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ede9fe',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}>
            <div>
              <p style={{ 
                fontSize: '0.75rem', 
                fontWeight: '500', 
                color: '#7c3aed', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em', 
                marginBottom: '4px'
              }}>Peak</p>
              <p style={{ 
                fontSize: '1.5rem', 
                fontWeight: '800', 
                color: '#1f2937'
              }}>
                {peakCorrections.toLocaleString()}
              </p>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>on {peakDate}</p>
          </div>
        </div>
      )}

      {/* Chart Section - Fixed size chart */}
      <div 
        style={{ 
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          padding: '16px',
          marginBottom: '12px',
          position: 'relative',
          overflow: 'auto', // Add scrolling if needed
        }}
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
              <p className="text-gray-700 font-medium mb-1">
                {titleNumber ? `Title ${titleNumber} Data Unavailable` : 'Data Unavailable'}
              </p>
              <p className="text-gray-600 mb-3">
                {titleNumber 
                  ? `Title ${titleNumber} appears to be missing from the eCFR API.`
                  : 'The requested data appears to be missing from the eCFR API.'}
              </p>
              {titleNumber && (
                <button
                  onClick={() => setTitleNumber(undefined)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 text-xs rounded-md transition-colors"
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
              <p className="text-gray-700 font-medium mb-1">No changes found</p>
              <p className="text-gray-500">Try selecting a different title or time period.</p>
            </div>
          </div>
        )}

        {/* Chart.js Line Chart with fixed dimensions */}
        {!loading && !error && trends.length > 0 && (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <div style={{ width: '100%', minWidth: '800px', height: '600px' }}>
              <Line 
                data={chartData} 
                options={chartOptions} 
                width={800}
                height={600}
              />
            </div>
          </div>
        )}
      </div>
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

// Helper function to calculate appropriate chart height based on screen size
function calculateChartHeight(): string {
  // Use window.innerWidth to determine screen size if available
  if (typeof window !== 'undefined') {
    const width = window.innerWidth;
    if (width < 640) return '350px'; // Small screens
    if (width < 1024) return '400px'; // Medium screens
    return '450px'; // Large screens
  }
  return '450px'; // Default for SSR
}
