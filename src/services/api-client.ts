import axios from 'axios';

export default axios.create({
  baseURL: 'https://api.rawg.io/api',
  params: {
    key: 'ad4a0c0cd4424adba305c70275eb223a',
  },
});

const api = axios.create({
  baseURL: 'https://api.rawg.io/api',
  params: {
    key: 'ad4a0c0cd4424adba305c70275eb223a',
  },
});

export interface FetchResponse<T> {
  count: number;
  next: string | null;
  results: T[];
}

export class apiClient<T> {
  endpoint: string;
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll(params = {}) {
    return api.get(this.endpoint, {
      params,
    });
  }
}
