import { callApi } from '@/utils/apiUtils';
import { customer } from '@/utils/endpoints/customer';



export const deleteCustomer = ({ pathParams }) =>
    callApi({ uriEndPoint: customer.deleteCustomer.v1, pathParams })
        .then((res) => res)
        .catch((err) => err);

export const getCustomer = ({ pathParams }) =>
    callApi({ uriEndPoint: customer.getCustomer.v1, pathParams })
        .then((res) => res)
        .catch((err) => err);

export const updateCustomer = ({ body, pathParams }) =>
    callApi({
        uriEndPoint: customer.updateCustomer.v1,
        body,
        pathParams,
    })
        .then((res) => ({ ...res, status: 'ok' }))
        .catch((err) => ({ ...err, status: 'notok' }));

export const updateCustomerContents = ({ body, pathParams }) => {
    return callApi({
        uriEndPoint: customer.updateCustomerContents.v1,
        body,
        pathParams,
    })
        .then((res) => res)
        .catch(() => { });
};
// API Service to get all subscription plans

export const getSubscriptionPlans = () =>
    callApi({ uriEndPoint: customer.getSubscriptionPlans.v1 })
        .then((res) => res)
        .catch((err) => err);


// API Service to get Documents
export const getCustomerContents = ({ pathParams }) => {
    return callApi({
        uriEndPoint: customer.getCustomerContents.v1,
        pathParams,
    })
        .then((res) => res)
        .catch(() => { });
};

// API Service to delete customer contents

export const deleteCustomerContents = ({ pathParams }) =>
    callApi({
        uriEndPoint: customer.deleteCustomerContents.v1,
        pathParams,
    })
        .then((res) => ({ ...res, status: 'ok' }))
        .catch((err) => ({ ...err, status: 'notok' }));


export const allCustomers = ({ query }) => {
    return callApi({ uriEndPoint: customer.allCustomers.v1, query })
        .then((res) => res)
        .catch((err) => err);
};

// API Service to Activate/Deactivate Customer

export const enableDisableCustomer = ({ pathParams }) => {
    return callApi({ uriEndPoint: customer.enableDisableCustomer.v1, pathParams })
        .then((res) => res)
        .catch(() => { });
};



