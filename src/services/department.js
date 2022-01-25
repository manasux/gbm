import { callApi } from '@/utils/apiUtils';
import { department } from '@/utils/endpoints/department';

export const createDepartment = ({ body, pathParams }) =>
  callApi({ uriEndPoint: department.createDepartment.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const getDepartments = ({ query }) =>
  callApi({ uriEndPoint: department.getDepartments.v1, query })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const deleteDepartment = ({ pathParams }) =>
  callApi({ uriEndPoint: department.deleteDepartment.v1, pathParams })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const updateDepartment = ({ pathParams, body }) =>
  callApi({ uriEndPoint: department.updateDepartment.v1, body, pathParams })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
