// src/components/ChangeHistory.tsx
import React from 'react';
import { useChangeHistory } from '../hooks/useChangeHistory';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const ChangeHistory: React.FC = () => {
  const { trends, loading, error } = useChangeHistory();

  if (loading) return <div>Loading historical changes...</div>;
  if (error) return <div className="text-red-700">Error: {error}</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Historical Changes</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trends}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="changes" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};