import { getallrequests } from '@/services/request';

const Model = {
  namespace: 'request',
  state: {
    requestList: null,
  },
  effects: {
    *getallrequests({ payload }, { call, put }) {
      const res = yield call(getallrequests, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'requestList',
      });
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
