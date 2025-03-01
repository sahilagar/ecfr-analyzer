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
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        border: '1px solid #e5e7eb'
      }}>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Agency Word Count</h2>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '160px',
          backgroundColor: '#f9fafb',
          borderRadius: '6px',
          border: '1px solid #e5e7eb'
        }}>
          <p className="text-gray-500 text-sm">Select an agency to view metrics</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        border: '1px solid #e5e7eb'
      }}>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Agency Word Count</h2>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '160px',
          backgroundColor: '#f9fafb',
          borderRadius: '6px',
          border: '1px solid #e5e7eb'
        }}>
          <div className="text-center">
            <p className="text-gray-700 mb-1">Loading...</p>
            <p className="text-gray-500 text-sm">Please wait while we fetch the data</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        border: '1px solid #e5e7eb'
      }}>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Agency Word Count</h2>
        <div className="p-4 bg-red-50 rounded-md border border-red-200">
          <p className="text-red-700 mb-1">Error loading word count data</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Filter out items with errors
  const validWordCounts = wordCounts.filter(item => !item.error);

  // Calculate total words across all titles
  const totalWords = validWordCounts.reduce((sum, item) => sum + item.count, 0);
  
  // Calculate average words per title
  const averageWords = validWordCounts.length > 0 
    ? Math.round(totalWords / validWordCounts.length) 
    : 0;

  // Find the title with the most words
  const maxTitle = validWordCounts.length > 0
    ? validWordCounts.reduce(
        (max, item) => (item.count > max.count ? item : max),
        validWordCounts[0]
      )
    : { titleNumber: 'N/A', count: 0 };

  // Format data for the chart
  const chartData = validWordCounts.map(item => ({
    title: String(item.titleNumber),
    wordCount: item.count
  }));

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto',
      padding: '16px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb'
    }}>
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Agency Word Count
      </h2>

      {/* Summary Metrics - Centered and bolded */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
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
            }}>Total Words</p>
            <p style={{ 
              fontSize: '1.5rem', 
              fontWeight: '800', 
              color: '#1f2937'
            }}>
              {totalWords.toLocaleString()}
            </p>
          </div>
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
            }}>Average per Title</p>
            <p style={{ 
              fontSize: '1.5rem', 
              fontWeight: '800', 
              color: '#1f2937'
            }}>
              {averageWords.toLocaleString()}
            </p>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>words</p>
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
            }}>Largest Title</p>
            <p style={{ 
              fontSize: '1.5rem', 
              fontWeight: '800', 
              color: '#1f2937'
            }}>
              {maxTitle.titleNumber}
            </p>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>{maxTitle.count.toLocaleString()} words</p>
        </div>
      </div>

      {/* Chart - Fixed height and aspect ratio */}
      <div style={{ 
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        padding: '16px',
        marginBottom: '12px',
        background: 'linear-gradient(to bottom, white, #f9fafb)'
      }}>
        <div style={{ height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
              <XAxis 
                dataKey="title" 
                tick={{ fontSize: 10 }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(67, 56, 202, 0.9)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '12px',
                  padding: '10px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ 
                  fontWeight: 'bold', 
                  marginBottom: '6px',
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.95)'
                }}
                itemStyle={{
                  padding: '2px 0'
                }}
                formatter={(value: number) => [`${value.toLocaleString()} words`, 'Word Count']}
                labelFormatter={(title) => `Title ${title}`}
                cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
              />
              <Bar 
                dataKey="wordCount" 
                radius={[4, 4, 0, 0]} 
                barSize={24}
                animationDuration={800}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Function to generate bar colors
const getBarColor = (index: number) => {
  const colors = [
    '#6366f1', // indigo-500
    '#4f46e5', // indigo-600
    '#4338ca', // indigo-700
    '#3730a3', // indigo-800
    '#818cf8', // indigo-400
    '#a5b4fc', // indigo-300
    '#7c3aed', // violet-600
    '#6d28d9', // violet-700
    '#5b21b6', // violet-800
    '#8b5cf6', // violet-500
    '#2563eb', // blue-600
    '#3b82f6', // blue-500
    '#60a5fa', // blue-400
  ];
  return colors[index % colors.length];
};
