// src/hooks/useECFRData.ts
import { useState, useEffect } from 'react';
import { ecfrApi, Agency } from '../utils/api';
import _ from 'lodash';

interface ECFRData {
  agencies: Agency[];
  loading: boolean;
  error: Error | null;
  selectedAgency: string | null;
  setSelectedAgency: (agencyId: string) => void;
}

export function useECFRData(): ECFRData {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAgencies() {
      try {
        setLoading(true);
        const data = await ecfrApi.getAgencies();
        // Sort agencies by name for better UX
        const sortedAgencies = _.sortBy(data, 'name');
        setAgencies(sortedAgencies);
        // Set first agency as default selection if none selected
        if (!selectedAgency && sortedAgencies.length > 0) {
          setSelectedAgency(sortedAgencies[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch agencies'));
      } finally {
        setLoading(false);
      }
    }

    fetchAgencies();
  }, []);

  return {
    agencies,
    loading,
    error,
    selectedAgency,
    setSelectedAgency
  };
}