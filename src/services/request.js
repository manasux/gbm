import apiEndPoints from '@/utils/apiEndPoints';
import { callApi } from '@/utils/apiUtils';

export const getallrequests = ({ query }) =>
  callApi({ uriEndPoint: apiEndPoints.request.getRequestList.v1, query })
    .then((res) => res)
    .catch(() => {});
