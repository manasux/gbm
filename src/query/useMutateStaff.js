import { useMutation } from 'react-query';
import { cloneDeep } from 'lodash';
import { queryClient } from '../layouts/SecurityLayout';
import {
  deleteStaffContents,
  updateStaffDetails,
  updateStaffContents,
  enableDisableStaff,
} from '@/services/staff';

// Calling Mutation to Update Staff Details

export function useUpdateStaff() {
  return useMutation((payload) => updateStaffDetails(payload));
}

// Calling Mutation to Activate/Deactivate Staff Members
export function useEnableDisableStaff() {
  return useMutation((payload) => enableDisableStaff(payload));
}

// Calling Mutation to Update Staff Contents

export function useUpdateStaffContents() {
  return useMutation((payload) => updateStaffContents(payload));
}

// Calling Mutation to Delete Staff Contents

export function useDeleteStaffContents() {
  return useMutation(
    (payload) => {
      return deleteStaffContents(payload);
    },

    {
      // onMutate: (variables) => {         TODO
      //   const partyId = variables?.pathParams?.partyId;
      //   const contentId = variables?.pathParams?.contentId;

      //   const contentQueryData = queryClient?.getQueriesData(['contents', partyId]);
      //   const [contentData] = [...contentQueryData]
      //   const [key, contents] = [...contentData]

      //   queryClient?.setQueriesData(['contents', partyId], (oldData) => {
      //     let copyOfOldData = cloneDeep(oldData);
      //     const updatedContents = oldData?.contents?.filter((content) => content?.id !== contentId);

      //     copyOfOldData.contents = updatedContents;
      //     return copyOfOldData;
      //   });

      //   return contents;
      // },
      onSuccess: (onSuccessData, variables, context) => {
        const partyId = variables?.pathParams?.partyId;
        const contentId = variables?.pathParams?.contentId;

        queryClient?.setQueriesData(['contents', partyId], (oldData) => {
          let copyOfOldData = cloneDeep(oldData);
          const updatedContents = oldData?.contents?.filter((content) => content?.id !== contentId);

          copyOfOldData.contents = updatedContents;
          return copyOfOldData;
        });
      },
      // onError: (err, variables, context) => {    TODO
      //   const partyId = variables?.pathParams?.partyId;

      //   queryClient?.setQueriesData(['contents', partyId], (oldData) => {
      //     return context;
      //   });

      // }
    },
  );
}
