import { AxiosRequestConfig } from 'axios';
import apiClient from '../services/api-client';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export interface FetchResponse<T> {
  count: number;
  results: T[];
}

const useInfiniteData = <T>(endpoint: string, requestConfig?: AxiosRequestConfig, deps?: any[]) => {
  return useInfiniteQuery({
    queryKey: ['data', endpoint, deps],
    queryFn: ({ signal, pageParam: page = 1 }) =>
      apiClient
        .get<FetchResponse<T>>(endpoint, { ...requestConfig, signal })
        .then((res) => res.data.results),
    getNextPageParam: (lastPage, allPages) => allPages.length + 1,
    initialPageParam: 0,
  });
};

export default useInfiniteData;
