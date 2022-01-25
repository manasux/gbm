import { callApi } from '@/utils/apiUtils';
import { hospital } from '@/utils/endpoints/hospital';

export const createHospital = (body) =>
  callApi({
    uriEndPoint: hospital.createHospital.v1,
    body,
  })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const allHospital = ({ body, query }) =>
  callApi({ uriEndPoint: hospital.allHospital.v1, body, query })
    .then((res) => res)
    .catch((err) => err);
export const createHospitalContacts = ({ body, query }) =>
  callApi({
    uriEndPoint: hospital.createHospitalContacts.v1,
    body,
    query
  })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));

export const getAllHospitalStafs = (query) =>
  callApi({ uriEndPoint: hospital.getAllHospitalStafs.v1, query })
    .then((res) => res)
    .catch((err) => err);
