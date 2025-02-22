// src/utils/api.ts
import axios from 'axios';

const BASE_URL = '/api'; // This will be proxied to https://www.ecfr.gov/api

// Types for API responses
export interface Agency {
  id: string;
  name: string;
  titles: string[];
}

export interface Correction {
  date: string;
  titleNumber: string;
  description: string;
  impact: string;
}

export interface TitleStructure {
  titleNumber: string;
  name: string;
  chapters: Array<{
    number: string;
    name: string;
  }>;
}

class ECFRClient {
  private adminClient;
  private versionerClient;
  private searchClient;

  constructor() {
    // Create separate clients for different API services
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

  // Admin Service Methods
  async getAgencies(): Promise<Agency[]> {
    try {
      console.log('Fetching agencies...');
      const response = await this.adminClient.get('/agencies.json');
      console.log('Agencies response:', response.data);
      return response.data.agencies;
    } catch (error) {
      console.error('Error fetching agencies:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        });
        throw new Error(`Failed to fetch agencies: ${error.message}`);
      }
      throw error;
    }
  }

  async getCorrections(): Promise<Correction[]> {
    const response = await this.adminClient.get('/corrections.json');
    return response.data;
  }

  async getTitleCorrections(title: string): Promise<Correction[]> {
    const response = await this.adminClient.get(`/corrections/title/${title}.json`);
    return response.data;
  }

  // Versioner Service Methods
  async getTitleContent(title: string, date: string): Promise<string> {
    const response = await this.versionerClient.get(`/full/${date}/title-${title}.xml`);
    return response.data;
  }

  async getTitleStructure(title: string, date: string): Promise<TitleStructure> {
    const response = await this.versionerClient.get(`/structure/${date}/title-${title}.json`);
    return response.data;
  }

  async getTitles(): Promise<TitleStructure[]> {
    const response = await this.versionerClient.get('/titles.json');
    return response.data;
  }

  // Search Service Methods
  async getDailyCounts(): Promise<Record<string, number>> {
    const response = await this.searchClient.get('/counts/daily');
    return response.data;
  }

  async getTitleCounts(): Promise<Record<string, number>> {
    const response = await this.searchClient.get('/counts/titles');
    return response.data;
  }
}

// Export a singleton instance
export const ecfrApi = new ECFRClient();