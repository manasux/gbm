import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
} from '@/services/department';

const Model = {
  namespace: 'department',
  state: { departmentList: null },
  effects: {
    *createDepartment({ payload }, { call }) {
      const res = yield call(createDepartment, payload);
      return res;
    },
    *getAllDepartment({ payload }, { call, put }) {
      const res = yield call(getDepartments, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'departmentList',
      });
      return res;
    },
    *deleteDepartment({ payload }, { call }) {
      const res = yield call(deleteDepartment, payload);
      return res;
    },
    *updateDepartment({ payload }, { call }) {
      const res = yield call(updateDepartment, payload);
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
