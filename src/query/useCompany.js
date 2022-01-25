import { useQuery } from 'react-query';
import { getSupervisors } from '@/services/company';

export function useGetSupervisors(payload) {
  const { query } = payload || '';

  return useQuery(
    ['companySupervisors', query?.roleTypeId || 'All'],
    () => getSupervisors(payload),
    {
      refetchOnWindowFocus: false,
    },
  );
}
