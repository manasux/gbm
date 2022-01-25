import { useQuery } from 'react-query';
import { cloneDeep } from 'lodash';
import { getStaffDetails, getStaffContents } from '@/services/staff';

export function useGetStaff(profileId) {
  return useQuery(['staff', profileId], () => getStaffDetails(profileId), {
    refetchOnWindowFocus: false,
  });
}

export function useGetContents(profileId) {
  return useQuery(['contents', profileId], () => getStaffContents(profileId), {
    refetchOnWindowFocus: false,
  });
}
