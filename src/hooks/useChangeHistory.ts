// src/hooks/useChangeHistory.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Correction {
  id: number;
  error_corrected: string;
}

export interface TrendData {
  date: string; // e.g. "YYYY-MM-DD", "YYYY-MM-01", or "YYYY-01-01"
  changes: number;
}

export function useChangeHistory(
  titleNumber?: number,
  granularity: 'day' | 'month' | 'year' = 'day',
  startDate?: Date,
  endDate?: Date
) {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCorrections() {
      try {
        // 1. Determine endpoint
        const endpoint = titleNumber
          ? `/api/admin/v1/corrections/title/${titleNumber}.json`
          : '/api/admin/v1/corrections.json';

        const response = await axios.get(endpoint);
        const corrections: Correction[] = response.data.ecfr_corrections || [];

        // 2. Filter by date range
        const filtered = corrections.filter((c) => {
          const d = new Date(c.error_corrected);
          if (startDate && d < startDate) return false;
          if (endDate && d > endDate) return false;
          return true;
        });

        // 3. Group by granularity
        const grouped: Record<string, number> = filtered.reduce((acc, c) => {
          const d = new Date(c.error_corrected);
          const key = getGroupingKey(d, granularity);
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // 4. Convert to array & sort
        const trendsArray: TrendData[] = Object.keys(grouped)
          .map((dateStr) => ({
            date: dateStr,
            changes: grouped[dateStr],
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
  }, [titleNumber, granularity, startDate, endDate]);

  return { trends, loading, error };
}

/** Return a date string based on granularity. */
function getGroupingKey(dateObj: Date, granularity: 'day' | 'month' | 'year'): string {
  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getUTCDate()).padStart(2, '0');

  if (granularity === 'day') {
    return `${year}-${month}-${day}`;
  } else if (granularity === 'month') {
    return `${year}-${month}-01`;
  } else {
    // year
    return `${year}-01-01`;
  }
}
