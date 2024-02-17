import { AxiosRequestConfig } from 'axios';
import apiClient from '../services/api-client';
import { useQuery } from '@tanstack/react-query';

interface FetchResponse<T> {
  count: number;
  results: T[];
}

const useData = <T>(endpoint: string, requestConfig?: AxiosRequestConfig, deps?: any[]) => {
  return useQuery({
    queryKey: ['data', endpoint, deps],
    queryFn: ({ signal }) =>
      apiClient
        .get<FetchResponse<T>>(endpoint, { ...requestConfig, signal })
        .then((res) => res.data.results),
    staleTime: 1000 * 60 * 60 * 1,
  });
};

export default useData;
