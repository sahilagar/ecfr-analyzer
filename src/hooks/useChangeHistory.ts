// src/hooks/useChangeHistory.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Correction {
  id: number;
  error_corrected: string;
}

export interface TrendData {
  date: string;   // e.g. "YYYY-MM-DD" or "YYYY-MM-01" or "YYYY-01-01"
  changes: number;
}

/**
 * Accepts:
 * - titleNumber: which title to fetch corrections for (if any)
 * - granularity: "day", "month", or "year"
 * - startDate, endDate: optional range filters
 */
export function useChangeHistory(
  titleNumber?: number,
  granularity: 'day'|'month'|'year' = 'day',
  startDate?: Date,
  endDate?: Date
) {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCorrections() {
      try {
        // Decide which endpoint to call
        const endpoint = titleNumber
          ? `/api/admin/v1/corrections/title/${titleNumber}.json`
          : '/api/admin/v1/corrections.json';

        const response = await axios.get(endpoint);
        const corrections: Correction[] = response.data.ecfr_corrections || [];

        // 1. Filter by date range (if startDate/endDate provided)
        const filtered = corrections.filter(c => {
          const d = new Date(c.error_corrected);
          if (startDate && d < startDate) return false;
          if (endDate && d > endDate) return false;
          return true;
        });

        // 2. Group by granularity
        const grouped: Record<string, number> = filtered.reduce((acc, c) => {
          const d = new Date(c.error_corrected);
          const key = getGroupingKey(d, granularity);
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // 3. Convert to array & sort by ascending date
        const trendsArray: TrendData[] = Object.keys(grouped)
          .map(dateStr => ({
            date: dateStr,
            changes: grouped[dateStr]
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

/** 
 * Returns a date key (string) based on granularity:
 * - day:   "YYYY-MM-DD"
 * - month: "YYYY-MM-01"
 * - year:  "YYYY-01-01"
 */
function getGroupingKey(dateObj: Date, granularity: 'day'|'month'|'year'): string {
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
