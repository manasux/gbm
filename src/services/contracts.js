import { callApi } from '@/utils/apiUtils';
import { contracts } from '@/utils/endpoints/contracts';



export const getContracts = ({ query }) =>
    callApi({ uriEndPoint: contracts?.getContracts?.v1, query })
        .then((res) => res)
        .catch(() => { });

export const getContractCounts = ({ query }) =>
    callApi({ uriEndPoint: contracts?.getContractCounts?.v1, query })
        .then((res) => res)
        .catch(() => { });

export const sendContractRequest = ({ body }) =>
    callApi({ uriEndPoint: contracts?.sendContractRequest?.v1, body })
        .then((res) => res)
        .catch(() => { });


