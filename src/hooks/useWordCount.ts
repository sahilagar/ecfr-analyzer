import { useState, useEffect } from 'react';
import { ecfrApi } from '../utils/api';
import axios from 'axios';

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
          // Use latest_issue_date if available; otherwise fallback
          titleDateMap.set(
            Number(t.number), 
            t.latest_issue_date || t.up_to_date_as_of || '2024-02-21'
          );
        });

        const results: WordCount[] = [];

        // 3. Process each title
        for (const title of agency.titles) {
          try {
            const effectiveDate = titleDateMap.get(Number(title)) || '2024-02-21';
            console.log(`Fetching content for title ${title} using date ${effectiveDate}`);
            const content = await ecfrApi.getTitleContent(title, effectiveDate);
            
            // Count words in the content
            const wordCount = calculateWordCount(content);
            
            results.push({
              titleNumber: title,
              count: wordCount
            });
          } catch (err: any) {
            console.error(`Error processing title ${title}:`, err);
            results.push({
              titleNumber: title,
              count: 0,
              error: err.message
            });
          }
        }

        setWordCounts(results);
      } catch (err: any) {
        console.error('Error fetching word counts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWordCounts();
  }, [agencyId]);

  return { wordCounts, loading, error };
}

function getAllText(content: any): string {
    let text = '';
  
    if (typeof content === 'string') {
      return content;
    } else if (Array.isArray(content)) {
      // Recursively process each item in the array.
      for (const item of content) {
        text += ' ' + getAllText(item);
      }
    } else if (typeof content === 'object' && content !== null) {
      // If the object has a "label" or "label_description", include them.
      if (typeof content.label === 'string') {
        text += ' ' + content.label;
      }
      if (typeof content.label_description === 'string') {
        text += ' ' + content.label_description;
      }
      // Recursively process all keys (except ones already handled).
      for (const key in content) {
        if (key !== 'label' && key !== 'label_description') {
          text += ' ' + getAllText(content[key]);
        }
      }
    }
    
    return text;
  }
  
  function calculateWordCount(content: any): number {
    const allText = getAllText(content);
    // Split by any whitespace and filter out empty strings.
    const words = allText.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
  }
  
