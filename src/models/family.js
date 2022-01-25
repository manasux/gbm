import {
  createFamily,
  deleteFamily,
  updateFamily,
  getFamily,
  getFamilyList,
} from '@/services/family';

const Model = {
  namespace: 'family',
  state: {
    families: null,
  },
  effects: {
    *getFamilies({ payload }, { call, put }) {
      const res = yield call(getFamilyList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'families',
      });
    },
    *getFamily({ payload }, { call }) {
      yield call(getFamily, payload);
      // yield put({
      //   type: 'setStates',
      //   payload: res,
      //   key: 'families',
      // });
      // return res?.data || [];
    },
    *createFamily({ payload }, { call }) {
      const res = yield call(createFamily, payload);
      return res;
    },

    *updateFamily({ payload }, { call }) {
      const res = yield call(updateFamily, payload);
      return res;
    },
    *deleteFamily({ payload }, { call, put }) {
      const res = yield call(deleteFamily, payload);
      yield put({
        type: 'getFamilies',
        payload: {
          query: {},
        },
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
