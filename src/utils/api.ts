// src/utils/api.ts

import axios from 'axios';

// Define API base URL
const BASE_URL = '/api'; // This will be proxied to https://www.ecfr.gov/api

// Interface matching the actual API response
export interface ApiAgency {
  name: string;
  short_name: string;
  display_name: string;
  sortable_name: string;
  slug: string;
  children: any[];
  cfr_references: Array<{
    title: number;
    chapter: string;
  }>;
}

// Our normalized Agency interface
export interface Agency {
  id: string;         // Using short_name as ID
  name: string;       // Using name
  titles: string[];   // Extracted from cfr_references
}

class ECFRClient {
  private adminClient;
  private versionerClient;
  private searchClient;

  constructor() {
    this.adminClient = axios.create({
      baseURL: `${BASE_URL}/admin/v1`,
    });

    this.versionerClient = axios.create({
      baseURL: `${BASE_URL}/versioner/v1`,
    });

    this.searchClient = axios.create({
      baseURL: `${BASE_URL}/search/v1`,
    });
  }

  async getAgencies(): Promise<Agency[]> {
    try {
      console.log('Fetching agencies...');
      const response = await this.adminClient.get<{ agencies: ApiAgency[] }>('/agencies.json');
      
      // Transform API response to our Agency interface
      const agencies = response.data.agencies.map(agency => ({
        id: agency.short_name || agency.slug,  // Use short_name as ID, fallback to slug
        name: agency.name,
        titles: agency.cfr_references.map(ref => ref.title.toString())
      }));

      // Log first few agencies after transformation
      console.log('Transformed agencies:', agencies.slice(0, 3));

      return agencies;
    } catch (error) {
      console.error('Error fetching agencies:', error);
      throw error;
    }
  }

  async getTitleContent(title: string, date: string = 'latest'): Promise<string> {
    try {
      // Format today's date if 'current' is passed
      let formattedDate = date;
      if (date === 'current') {
        const today = new Date();
        formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
      }
      
      console.log(`Fetching content for title ${title} on date ${formattedDate}`);
      const response = await this.versionerClient.get(`/full/${formattedDate}/title-${title}.xml`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // If the title doesn't exist for current date, try 'latest'
        if (date !== 'latest') {
          console.log(`Title ${title} not found for ${date}, trying latest version`);
          return this.getTitleContent(title, 'latest');
        }
      }
      throw error;
    }
  }

  async getTitleStructure(title: string, date: string): Promise<any> {
    const response = await this.versionerClient.get(`/structure/${date}/title-${title}.json`);
    return response.data;
  }

  async getTitles(): Promise<any[]> {
    const response = await this.versionerClient.get('/titles.json');
    return response.data;
  }
}

// Export a singleton instance
export const ecfrApi = new ECFRClient();