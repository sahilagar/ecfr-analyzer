import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',  // This will be proxied by Vercel to https://www.ecfr.gov/api
  timeout: 30000
});

export interface Agency {
  id: string;
  name: string;
  shortName: string;
  titles: number[];
}

class ECFRClient {
  async getAgencies(): Promise<Agency[]> {
    try {
      console.log('Fetching agencies...');
      const response = await api.get('/admin/v1/agencies.json');
      
      // Access the agencies array from the response
      const { agencies } = response.data;
      
      // Transform the response to match your expected format
      const transformedAgencies = agencies.map((agency: any) => ({
        id: agency.slug,
        name: agency.display_name,
        shortName: agency.short_name,
        titles: this.extractUniqueTitles(agency.cfr_references || [])
      }));
      
      console.log('Transformed agencies:', transformedAgencies);
      return transformedAgencies;
    } catch (error) {
      console.error('Error fetching agencies:', error);
      throw this.formatError(error);
    }
  }

  async getTitleContent(titleNumber: string | number, date: string) {
    try {
      console.log(`Fetching content for title ${titleNumber} on date ${date}`);
      const response = await api.get(`/versioner/v1/structure/${date}/title-${titleNumber}.json`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching title ${titleNumber}:`, {
        error,
        config: error.config,
        response: error.response
      });
      throw this.formatError(error);
    }
  }

  private extractUniqueTitles(references: Array<{ title: number }>) {
    // Get unique title numbers from references
    return [...new Set(references.map(ref => ref.title))];
  }

  private formatError(error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data?.message || error.message,
        url: error.config?.url || '',
        details: error.response.data
      };
    } else if (error.request) {
      return {
        status: 500,
        message: 'No response received from server',
        url: error.config?.url || '',
        details: error.request
      };
    } else {
      return {
        status: 500,
        message: error.message,
        url: '',
        details: error
      };
    }
  }
}

export const ecfrApi = new ECFRClient();
