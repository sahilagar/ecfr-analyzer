import { useState, useEffect } from 'react';
import { ecfrApi } from '../utils/api';
import axios from 'axios'; // we’ll use axios to fetch titles data

interface WordCount {
  titleNumber: string | number;
  count: number;
  error?: string;
}

export function useWordCount(agencyId: string | null) {
  const [wordCounts, setWordCounts] = useState<WordCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agencyId) {
      setWordCounts([]);
      return;
    }

    const fetchWordCounts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 1. Get the agency details
        const agencies = await ecfrApi.getAgencies();
        console.log('Available agencies:', agencies);
        console.log('Looking for agency ID:', agencyId);
        
        const agency = agencies.find(a => a.id === agencyId);
        if (!agency) {
          throw new Error(`Agency not found: ${agencyId}`);
        }

        // 2. Fetch titles data to determine effective dates
        const titlesResponse = await axios.get('/api/versioner/v1/titles.json');
        const titlesData = titlesResponse.data.titles;
        const titleDateMap = new Map<number, string>();
        titlesData.forEach((t: any) => {
          // Use latest_issue_date if available; otherwise, fallback to up_to_date_as_of or a default value
          titleDateMap.set(
            Number(t.number), 
            t.latest_issue_date || t.up_to_date_as_of || '2024-02-21'
          );
        });

        const results: WordCount[] = [];

        // 3. Process each title sequentially
        for (const title of agency.titles) {
          try {
            const effectiveDate = titleDateMap.get(Number(title)) || '2024-02-21';
            console.log(`Fetching content for title ${title} using date ${effectiveDate}`);
            const content = await ecfrApi.getTitleContent(title, effectiveDate);
            
            // Count words in the content (using JSON string length as a proxy)
            const wordCount = calculateWordCount(content);
            
            results.push({
              titleNumber: title,
              count: wordCount
            });
          } catch (error: any) {
            console.error(`Error processing title ${title}:`, error);
            results.push({
              titleNumber: title,
              count: 0,
              error: error.message
            });
          }
        }

        setWordCounts(results);
      } catch (error: any) {
        console.error('Error fetching word counts:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWordCounts();
  }, [agencyId]);

  return { wordCounts, loading, error };
}

function calculateWordCount(content: any): number {
  // For now, we're using the length of the JSON string as a simple proxy
  return JSON.stringify(content).length;
}