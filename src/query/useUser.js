import { useQuery } from 'react-query';
import { queryCurrent } from '@/services/user';

export function useGetUser() {
  return useQuery(['currentUser'], () => queryCurrent());
}
