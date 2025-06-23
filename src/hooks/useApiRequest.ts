
import { useState, useEffect } from 'react';

interface UseApiRequestResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useApiRequest = <T>(
  apiCall: () => Promise<T>,
  deps: any[] = []
): UseApiRequestResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, deps);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};
