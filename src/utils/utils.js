import { parse } from 'querystring';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = (path) => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);
export const getPathNames = () => window.location.pathname.split('/');

export const getIntials = (name) => {
  const fullname = name && name.split(' ');
  const firstname = fullname[0];
  const lastname = fullname[fullname.length - 1];
  return lastname !== firstname ? firstname[0] + lastname[0] : firstname[0];
};

export const getFormatedPhoneObject = (phone, countryCode) => ({
  phone: phone?.slice(3, 10),
  countryCode: countryCode,
  areaCode: phone?.slice(0, 3),
  // extension: '',
});
export const getPhoneObject = (phone, countryCode) => ({
  phone: phone?.slice(3, 10),
  countryCode: countryCode,
  areaCode: phone?.slice(0, 3),
  // extension: '',
});

export function getRedirectURL(cb) {
  const urlParams = new URL(window.location.href);
  const params = getPageQuery();
  let { redirect } = params;

  if (redirect) {
    const redirectUrlParams = new URL(redirect);

    if (redirectUrlParams.origin === urlParams.origin) {
      redirect = redirect.substr(urlParams.origin.length);

      if (redirect.match(/^\/.*#/)) {
        redirect = redirect.substr(redirect.indexOf('#') + 1);
      }
      cb(redirect);
    } else {
      window.location.href = redirect;
    }
  }
}
