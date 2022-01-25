import { callApi } from '@/utils/apiUtils';
import { family } from '@/utils/endpoints/family';

export const createFamily = (body) =>
  callApi({ uriEndPoint: family.createFamily.v1, body })
    .then((res) => res)
    .catch((err) => err);

export const getFamilyList = ({ query }) =>
  callApi({ uriEndPoint: family.getFamilies.v1, query })
    .then((res) => res)
    .catch((err) => err);

export const getFamily = ({ query }) =>
  callApi({ uriEndPoint: family.getFamily.v1, query })
    .then((res) => res)
    .catch((err) => err);

export const updateFamily = ({ query, body }) =>
  callApi({ uriEndPoint: family.updateFamily.v1, query, body })
    .then((res) => res)
    .catch((err) => err);

export const deleteFamily = () =>
  callApi({ uriEndPoint: family.updateFamily.v1 })
    .then((res) => res)
    .catch((err) => err);
