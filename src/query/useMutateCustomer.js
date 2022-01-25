import { useMutation } from 'react-query';
import { cloneDeep } from 'lodash';
import { queryClient } from '../layouts/SecurityLayout';
import {
  updateCustomer,
  deleteCustomerContents,
  updateCustomerContents,
  enableDisableCustomer,
} from '@/services/customer';

export function useUpdateCustomer() {
  return useMutation((payload) => {
    return updateCustomer(payload);
  });
}
export function useUpdateCustomerContents() {
  return useMutation((payload) => updateCustomerContents(payload));
}

export function useDeleteCustomerContents() {
  return useMutation(
    (payload) => {
      return deleteCustomerContents(payload);
    },
    {
      // onSuccess: (onSuccessData, variables, context) => {
      //   const partyId = variables?.pathParams?.partyId;
      //   const contentId = variables?.pathParams?.contentId;
      //   const oldState = queryClient.getQueriesData('customerContents', partyId);
      //   queryClient?.setQueriesData(['customerContents', partyId], (oldData) => {
      //     const updatedContents = oldData?.contents?.map((content) => {
      //       return content?.id !== contentId;
      //     });
      //     let copyOfOldData = cloneDeep(oldData);
      //     copyOfOldData.contents = updatedContents;
      //     return copyOfOldData;
      //   });
      // },
    },
  );
}

// Calling Mutation to Activate/Deactivate Customer
export function useEnableDisableCustomer() {
  return useMutation((payload) => enableDisableCustomer(payload));
}
