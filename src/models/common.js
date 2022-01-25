import {
  getCountriesList,
  getCountryStates,
  uploadContent,
  getTelephonicCode,
  pinCodeContent,
} from '@/services/common';

const Model = {
  namespace: 'common',
  state: {
    stateCodes: null,
    contentId: null,
    pinCodeList: null,
  },
  effects: {
    // API Method to Get All Countries Telephonic Codes

    *getTelephonicCode(_, { call, put }) {
      const res = yield call(getTelephonicCode);
      const teleInfo = res?.data?.map((item) => {
        return {
          ...item,
          formattedTeleCode: `+${item?.teleCode}`,
        };
      });
      yield put({
        type: 'setStates',
        payload: teleInfo,
        key: 'telephonicCode',
      });
      return res;
    },

    *getStateCodes({ payload }, { call, put }) {
      const res = yield call(getCountryStates, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'stateCodes',
      });
    },
    *getCountriesList({ payload }, { call, put }) {
      const res = yield call(getCountriesList, payload);
      yield put({
        type: 'setStates',
        payload: res?.data || [],
        key: 'countriesList',
      });
      return res?.data || [];
    },
    *pinCodeContent({ payload }, { call, put }) {
      const res = yield call(pinCodeContent, payload);
      yield put({
        type: 'setStates',
        payload: res?.data || [],
        key: 'pinCodeList',
      });
      return res?.data || [];
    },
    *uploadContent({ payload }, { call, put }) {
      const res = yield call(uploadContent, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'contentId',
      });
      return res;
    },
  },
  reducers: {
    setStates(state, { payload, key }) {
      return {
        ...state,
        [key]: payload,
      };
    },
  },
};
export default Model;
