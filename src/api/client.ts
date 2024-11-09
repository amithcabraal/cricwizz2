import axios, { AxiosResponse } from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://cricket.sportmonks.com/api/v2.0';

interface APIResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface APIDebugInfo {
  headers: Record<string, string>;
  status: number;
  url: string;
  timestamp: string;
  responseData: unknown;
}

let lastAPIResponse: APIDebugInfo | null = null;

export const getLastAPIResponse = () => lastAPIResponse;

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_token: API_KEY
  },
  timeout: 10000
});

api.interceptors.response.use(
  (response: AxiosResponse<APIResponse<any>>) => {
    lastAPIResponse = {
      headers: Object.fromEntries(
        Object.entries(response.headers).map(([key, value]) => [key, String(value)])
      ),
      status: response.status,
      url: response.config.url || '',
      timestamp: new Date().toISOString(),
      responseData: response.data
    };

    if (!response.data?.data) {
      throw new Error('Invalid API response format');
    }
    return response.data.data;
  },
  error => {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('API Error:', errorMessage);
    
    if (error.response) {
      lastAPIResponse = {
        headers: Object.fromEntries(
          Object.entries(error.response.headers).map(([key, value]) => [key, String(value)])
        ),
        status: error.response.status,
        url: error.config.url || '',
        timestamp: new Date().toISOString(),
        responseData: error.response.data
      };
    }
    
    throw new Error(
      error.response?.status === 401 
        ? 'Invalid API key. Please check your credentials.'
        : `Failed to fetch data: ${errorMessage}`
    );
  }
);

export const fetchLiveMatches = async (): Promise<Match[]> => {
  try {
    const response: Match[] = await api.get('/fixtures', {
      params: {
        include: 'localteam,visitorteam,venue',
        filter: {
          status: ['NS', 'IN']
        }
      }
    });
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Error fetching live matches:', error);
    throw error;
  }
};

export const fetchMatchDetails = async (matchId: number): Promise<Match> => {
  try {
    const response: Match = await api.get(`/fixtures/${matchId}`, {
      params: {
        include: 'localteam,visitorteam,batting,bowling,scoreboards,balls'
      }
    });
    
    if (!response || !response.id) {
      throw new Error('Invalid match data received');
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching match details:', error);
    throw error;
  }
};