
import { useState, useEffect } from 'react';
import { AxiosRequestConfig } from 'axios';
import { makeRequest } from '../services/api';

export function useApi<T>(config: AxiosRequestConfig, immediate = true) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await makeRequest<T>(config);
      setData(result);
      return result;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      fetchData().catch(e => console.error("Failed to fetch data:", e));
    }
  }, []);

  return { data, isLoading, error, refetch: fetchData };
}
