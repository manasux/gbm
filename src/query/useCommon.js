import { useQuery } from 'react-query';
import { getCountriesList } from '@/services/common';

export function useGetCountries() {
  return useQuery(['countries'], () => getCountriesList(), {
    refetchOnWindowFocus: false,
  });
}
