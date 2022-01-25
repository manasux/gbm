import { callApi, hostname } from '@/utils/apiUtils';
import { common } from '@/utils/endpoints/common';
import request from '@/utils/request';
import Axios from 'axios';

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export const userLogin = (apiKey) =>
  Axios({
    method: 'post',
    url: `${hostname()}/xapi/v1/access/token`,
    headers: {
      apiKey,
    },
    timeout: 10000,
  })
    .then((response) => {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      return {
        status: 'ok',
        resp: response,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
    })
    .catch((err) => ({
      status: 'notok',
      currentAuthority: 'guest',
      error: err.response,
    }));

export function checkServer() {
  return callApi({
    uriEndPoint: common.checkServer.v1,
  })
    .then((response) => response)
    .catch(() => ({}));
}
