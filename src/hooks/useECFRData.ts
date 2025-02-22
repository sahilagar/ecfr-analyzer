import { useState, useEffect } from 'react';
import { ecfrApi } from '../utils/api';
import type { Agency } from '../utils/api';

export function useECFRData() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const agencyData = await ecfrApi.getAgencies();
        console.log('First few agencies:', agencyData.slice(0, 3).map(a => ({id: a.id, name: a.name})));
        setAgencies(agencyData);
      } catch (err) {
        console.error('Error fetching agencies:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch agencies'));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleAgencySelect = (agencyId: string | null) => {
    console.log('Selecting agency ID:', agencyId);
    if (agencyId) {
      const agency = agencies.find(a => a.id === agencyId);
      console.log('Found agency:', agency);
    }
    setSelectedAgency(agencyId);
  };

  return {
    agencies,
    selectedAgency,
    setSelectedAgency: handleAgencySelect,
    loading,
    error
  };
}
