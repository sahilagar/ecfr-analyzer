// src/hooks/useChangeHistory.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Correction {
  id: number;
  error_corrected: string;
  // other fields can be added if needed
}

export interface TrendData {
  date: string;
  changes: number;
}

export function useChangeHistory() {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCorrections() {
      try {
        // Fetch the corrections data
        const response = await axios.get('/api/admin/v1/corrections.json');
        // Note: the root property is "ecfr_corrections" in your response
        const corrections: Correction[] = response.data.ecfr_corrections;
        
        // Group corrections by the error_corrected date (formatted as YYYY-MM-DD)
        const grouped: Record<string, number> = corrections.reduce((acc, correction) => {
          const date = new Date(correction.error_corrected)
            .toISOString()
            .split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Convert the grouped data into an array and sort by date
        const trendsArray: TrendData[] = Object.keys(grouped)
          .map(date => ({
            date,
            changes: grouped[date]
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setTrends(trendsArray);
      } catch (err: any) {
        setError(err.message || 'Failed to load corrections');
      } finally {
        setLoading(false);
      }
    }

    fetchCorrections();
  }, []);

  return { trends, loading, error };
}
