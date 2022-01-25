import { useQuery } from 'react-query';
import { cloneDeep } from 'lodash';
import { queryClient } from '../layouts/BasicLayout';
import {
  allCustomers,
  getCustomer,
  getSubscriptionPlans,
  getCustomerContents,
} from '@/services/customer';

export function useGetAllCustomers({ payload }) {
  const currentPage = payload?.currentPage;
  return useQuery(['customers', currentPage], () => allCustomers(payload), {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
}

export function useGetCustomer({ pathParams }) {
  return useQuery(['customer', pathParams?.customerId], () => getCustomer({ pathParams }), {
    refetchOnWindowFocus: false,
  });
}

export function useGetSubscriptionPlans() {
  return useQuery(['plans'], () => getSubscriptionPlans(), { refetchOnWindowFocus: false });
}

export function useGetContents({ pathParams }) {
  return useQuery(['customerContents', pathParams?.customerId], () =>
    getCustomerContents({ pathParams }),
  );
}
