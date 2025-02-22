// src/hooks/useWordCount.ts

import { useState, useEffect } from 'react';
import { ecfrApi } from '../utils/api';
import axios from 'axios';

interface WordCountData {
  totalWords: number;
  titleBreakdown: {
    titleId: string;
    wordCount: number;
  }[];
}

export function useWordCount(agencyId: string | null) {
  const [wordCountData, setWordCountData] = useState<WordCountData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchWordCounts() {
      if (!agencyId) return;

      try {
        setLoading(true);
        setError(null);

        // Get agencies data
        const agencies = await ecfrApi.getAgencies();
        console.log('Available agencies:', agencies.map(a => ({ id: a.id, name: a.name })));
        console.log('Looking for agency ID:', agencyId);

        const agency = agencies.find(a => a.id === agencyId);
        
        if (!agency) {
          throw new Error(`Agency with ID ${agencyId} not found`);
        }

        // Get content for each title and count words
        const titleCounts = await Promise.all(
          agency.titles.map(async (titleId) => {
            try {
              console.log(`Fetching content for title ${titleId}`);
              const content = await ecfrApi.getTitleContent(titleId);
              const wordCount = countWords(content);
              console.log(`Title ${titleId} word count:`, wordCount);
              return {
                titleId,
                wordCount
              };
            } catch (err) {
              console.error(`Error processing title ${titleId}:`, err);
              if (axios.isAxiosError(err)) {
                console.error('API Error details:', {
                  status: err.response?.status,
                  message: err.message,
                  url: err.config?.url
                });
              }
              return {
                titleId,
                wordCount: 0
              };
            }
          })
        );

        const validTitleCounts = titleCounts.filter(title => title.wordCount > 0);
        const totalWords = validTitleCounts.reduce((sum, title) => sum + title.wordCount, 0);

        setWordCountData({
          totalWords,
          titleBreakdown: validTitleCounts
        });

      } catch (err) {
        console.error('Error in fetchWordCounts:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch word counts'));
      } finally {
        setLoading(false);
      }
    }

    fetchWordCounts();
  }, [agencyId]);

  return { wordCountData, loading, error };
}

// Helper function to count words in XML content
function countWords(xmlContent: string): number {
  try {
    // Remove XML comments
    const noComments = xmlContent.replace(/<!--[\s\S]*?-->/g, '');
    
    // Remove XML tags but preserve their content
    const noTags = noComments.replace(/<[^>]+>/g, ' ');
    
    // Handle special characters and punctuation
    const cleanText = noTags
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Split and filter words
    const words = cleanText
      .split(' ')
      .filter(word => word.length > 0)
      .filter(word => !/^\d+$/.test(word)); // Exclude pure numbers

    return words.length;
  } catch (error) {
    console.error('Error counting words:', error);
    return 0;
  }
}