import apiEndPoints from '@/utils/apiEndPoints';
import { callApi, hostname } from '@/utils/apiUtils';
import Axios from 'axios';

export const userRegister = (body) =>
  Axios.post(`${hostname()}/xapi/v1/accounts`, body)
    .then((result) => result?.data)
    .catch(() => {});

export const checkEmail = (path) =>
  Axios.post(`${hostname()}/xapi/v1/user/isExistingLoginId?user_id=${path}`);

export const queryCurrent = () =>
  callApi({ uriEndPoint: apiEndPoints.user.fetchCurrent.v1 })
    .then((res) => res)
    .catch(() => {});

export const updateCurrent = (body) =>
  callApi({ uriEndPoint: apiEndPoints.user.updateCurrent.v1, body })
    .then((res) => res)
    .catch(() => {});

export const userAvatar = ({ body, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.user.uploadAvatar.v1, body, pathParams })
    .then((res) => res)
    .catch(() => {});

export const updateUserProfile = ({ body, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.user.updateProfile.v1, body, pathParams })
    .then((res) => res)
    .catch(() => {});

export const forgotUserPassword = ({ body }) =>
  callApi({ uriEndPoint: apiEndPoints.user.forgotPassword.v1, body })
    .then((res) => res)
    .catch(() => {});

export const updateUserPassword = ({ body }) =>
  callApi({ uriEndPoint: apiEndPoints.user.updatePassword.v1, body })
    .then((res) => res)
    .catch(() => {});

export const resetUserPassword = ({ body }) =>
  callApi({ uriEndPoint: apiEndPoints.user.resetPassword.v1, body })
    .then((res) => res)
    .catch(() => {});
